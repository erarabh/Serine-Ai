(() => {
  // Retrieve attributes from the current script tag
  const currentScript = document.currentScript;
  const siteID = currentScript?.getAttribute('data-siteid') || 'default-site';
  const borderColor = currentScript?.getAttribute('data-border-color') || '#007BFF'; // default blue

  if (!siteID) {
    console.error('Widget: Missing data-siteid attribute');
    return;
  }

  // Create widget container
  const container = document.createElement('div');
  container.id = 'serine-widget';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.width = '300px';
  container.style.height = '400px';
  container.style.background = '#fff';
  container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  container.style.borderRadius = '10px';
  container.style.overflow = 'hidden';
  container.style.zIndex = '1000';
  
  // Set the border using the provided borderColor
  container.style.border = `2px solid ${borderColor}`;

  // Create close button that hides (rather than removes) the widget container
  const closeBtn = document.createElement('button');
  closeBtn.innerText = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '5px';
  closeBtn.style.right = '5px';
  closeBtn.style.background = 'red';
  closeBtn.style.color = 'white';
  closeBtn.style.border = 'none';
  closeBtn.style.padding = '5px';
  closeBtn.style.cursor = 'pointer';
  
  // Instead of removing the container, simply hide it
  closeBtn.onclick = () => {
    container.style.display = 'none';
  };

  // Create an iframe to inject the chat interface
  const iframe = document.createElement('iframe');
  // Set the source URL (modify as needed for production)
  iframe.src = `http://localhost:5173/?siteid=${siteID}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  // Append elements to the container
  container.appendChild(closeBtn);
  container.appendChild(iframe);

  // Append the widget container to the document body
  document.body.appendChild(container);

  // Optional: Listen for messages from the main page (if needed)
  window.addEventListener("message", (event) => {
    if (event.data.type === "widgetEvent") {
      console.log("Received message from main page:", event.data);
      // Additional actions can be handled here.
    }
  });
})();
