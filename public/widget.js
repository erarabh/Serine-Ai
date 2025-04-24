(() => {
  const siteID = document.currentScript?.getAttribute('data-siteid') || 'default-site'; // Fetch site ID
  
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

  // Create close button
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
  closeBtn.onclick = () => container.remove();

  // Inject chat interface
  const iframe = document.createElement('iframe');
  iframe.src = `http://localhost:5173/?siteid=${siteID}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  // Add elements to container
  container.appendChild(closeBtn);
  container.appendChild(iframe);

  // Append widget to body
  document.body.appendChild(container);

  // **Event Listener for Messages from the Parent Page**
  window.addEventListener("message", (event) => {
    if (event.data.type === "widgetEvent") {
      console.log("Received message from main page:", event.data);
      // Handle specific widget actions (e.g., resize, update siteID, etc.)
    }
  });
})();
