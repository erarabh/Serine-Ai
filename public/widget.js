(() => {
  // Retrieve attributes from the current script tag
  const currentScript = document.currentScript;
  const siteID = currentScript?.getAttribute('data-siteid') || 'default-site';
  const borderColor = currentScript?.getAttribute('data-border-color') || '#007BFF'; // default blue

  if (!siteID) {
    console.error('Widget: Missing data-siteid attribute');
    return;
  }

  // Create widget container and set it initially hidden
  const container = document.createElement('div');
  container.id = 'serine-widget';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.width = '300px';
  container.style.height = '400px';
  container.style.backgroundColor = '#fff';
  container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  container.style.borderRadius = '10px';
  container.style.overflow = 'hidden';
  container.style.zIndex = '1000';
  // Apply a thicker border using the provided border color
  container.style.border = `4px solid ${borderColor}`;
  // Initially hide the widget
  container.style.display = 'none';

  // Create close button that hides (rather than removes) the widget container
  const closeBtn = document.createElement('button');
  closeBtn.innerText = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '5px';
  closeBtn.style.right = '5px';
  closeBtn.style.backgroundColor = 'red';
  closeBtn.style.color = 'white';
  closeBtn.style.border = 'none';
  closeBtn.style.padding = '5px';
  closeBtn.style.cursor = 'pointer';
  
  // When clicked, hide the container and run any global callback (to show toggle icon)
  closeBtn.onclick = () => {
    container.style.display = 'none';
    // If a global callback is defined, call it so that the floating icon reappears
    if (typeof window.onWidgetClose === 'function') {
      window.onWidgetClose();
    }
  };

  // Create an iframe that loads the chat interface
  const iframe = document.createElement('iframe');
  // Adjust the src URL as needed (e.g., production URL insteaad of localhost)
  iframe.src = `http://localhost:5173/?siteid=${siteID}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  // Append the close button and iframe to the container
  container.appendChild(closeBtn);
  container.appendChild(iframe);

  // Append the widget container to the document body
  document.body.appendChild(container);

  // Optional: Listen for messages from the parent page (if needed)
  window.addEventListener("message", (event) => {
    if (event.data.type === "widgetEvent") {
      console.log("Received message from main page:", event.data);
      // Handle additional widget actions if necessary.
    }
  });
})();
