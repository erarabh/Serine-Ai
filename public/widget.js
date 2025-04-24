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
  container.style.backgroundColor = '#fff';
  container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  container.style.borderRadius = '10px';
  container.style.overflow = 'hidden';
  container.style.zIndex = '1000';
  // Apply a thicker border using the provided border color
  container.style.border = `4px solid ${borderColor}`;
  // Initial hidden state: zero opacity, slide down, no pointer events.
  container.style.opacity = '0';
  container.style.transform = 'translateY(50px)';
  container.style.pointerEvents = 'none';
  container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  // Create close button that hides (instead of removing) the widget container
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
  
  // When clicked, remove the "visible" class to hide (animate out) the widget.
  closeBtn.onclick = () => {
    container.classList.remove('visible');
    // Call global callback after transition completes (300ms)
    if (typeof window.onWidgetClose === 'function') {
      setTimeout(() => { window.onWidgetClose(); }, 300);
    }
  };

  // Create an iframe to load the chat interface
  const iframe = document.createElement('iframe');
  // Set the source URL (modify as needed for production)
  iframe.src = `http://localhost:5173/?siteid=${siteID}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  // Append the close button and iframe to the container
  container.appendChild(closeBtn);
  container.appendChild(iframe);

  // Append the widget container to the document body
  document.body.appendChild(container);

  // Append a style tag for the "visible" class so that when added, the widget appears.
  const style = document.createElement('style');
  style.innerHTML = `
    #serine-widget.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(style);

  // Optional: Listen for messages from the parent page if needed.
  window.addEventListener("message", (event) => {
    if (event.data.type === "widgetEvent") {
      console.log("Received message from main page:", event.data);
      // Additional widget actions can be handled here.
    }
  });
})();
