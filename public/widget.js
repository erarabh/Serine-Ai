(() => {
  // Retrieve the current script element to read data attributes.
  const currentScript = document.currentScript;
  // Fetch the site ID from a data attribute, or default to "default-site"
  const siteID = currentScript?.getAttribute('data-siteid') || 'default-site';
  // Fetch the border color from a data attribute, or default to blue (#007BFF)
  const borderColor = currentScript?.getAttribute('data-border-color') || '#007BFF';
  
  if (!siteID) {
    console.error('Widget: Missing data-siteid attribute');
    return;
  }

  // Create the widget container
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
  // Set the border using the borderColor option from HTML
  container.style.border = `2px solid ${borderColor}`;

  // Create the close button
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
  // When the close button is clicked, remove the widget from the DOM
  closeBtn.onclick = () => container.remove();

  // Create an iframe to load the chat interface for the given siteID
  const iframe = document.createElement('iframe');
  // Here, change the iframe src URL as needed (e.g., production URL instead of localhost)
  iframe.src = `http://localhost:5173/?siteid=${siteID}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  // Append the close button and the iframe to the container
  container.appendChild(closeBtn);
  container.appendChild(iframe);

  // Finally, append the container to the document body
  document.body.appendChild(container);

  // Optional: Listen for messages from the parent page
  window.addEventListener("message", (event) => {
    if (event.data.type === "widgetEvent") {
      console.log("Received message from main page:", event.data);
      // Add code to handle widget actions (e.g., resizing, configuration updates, etc.)
    }
  });
})();
