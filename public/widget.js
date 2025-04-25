(() => {
  // Retrieve attributes from the current script tag
  const currentScript = document.currentScript;
  const siteID = currentScript?.getAttribute('data-siteid') || 'default-site';
  const borderColor = currentScript?.getAttribute('data-border-color') || '#007BFF'; // default blue

  if (!siteID) {
    console.error('Widget: Missing data-siteid attribute');
    return;
  }

  // Function to track events – now it sends messages to an API (like mailing a letter)
  function trackEvent(eventName, data) {
    // First, write the message in our secret notebook (console)
    console.log(`Tracking event: ${eventName}`, data);
    // Now, send that message to your analytics server using an API call.
    fetch('https://your-analytics-endpoint.com/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: eventName,
        data: data
      })
    })
    .then(response => response.json())
    .then(result => console.log("Event sent:", result))
    .catch(error => console.error("Error sending event:", error));
  }

  // Create widget container (the little chat box that appears)
  const container = document.createElement('div');
  container.id = 'serine-widget';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.height = '400px';
  container.style.backgroundColor = '#fff';
  container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  container.style.borderRadius = '10px';
  container.style.overflow = 'hidden';
  container.style.zIndex = '1000';
  container.style.border = `4px solid ${borderColor}`;
  container.style.opacity = '0';
  container.style.transform = 'translateY(50px)';
  container.style.pointerEvents = 'none';
  container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  // Ensure the container is in the DOM
  container.style.display = 'block';

  // Function to update container dimensions responsively
  function updateContainerStyle() {
    if (window.innerWidth < 640) {
      container.style.width = '90%';
      container.style.right = '5%';
      container.style.left = '5%';
    } else {
      container.style.width = '300px';
      container.style.right = '20px';
      container.style.left = '';
    }
  }
  updateContainerStyle();
  window.addEventListener('resize', updateContainerStyle);

  // Create close button that hides the widget
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
  closeBtn.onclick = () => {
    container.classList.remove('visible');
    trackEvent('widget_close', { timestamp: new Date().toISOString(), siteID });
    setTimeout(() => {
      container.style.display = 'none';
      if (typeof window.onWidgetClose === 'function') {
        window.onWidgetClose();
      }
    }, 300);
  };

  // Create an iframe to load the chat interface (this is your chatbot)
  const iframe = document.createElement('iframe');
  // For testing, the URL is set to localhost; update if needed for production
  iframe.src = `http://localhost:5173/?siteid=${siteID}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  // Append the close button and iframe to the widget container
  container.appendChild(closeBtn);
  container.appendChild(iframe);
  document.body.appendChild(container);

  // Insert a style element for the "visible" class to handle transitions
  const style = document.createElement('style');
  style.innerHTML = `
    #serine-widget.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
      pointer-events: auto !important;
      display: block !important;
    }
  `;
  document.head.appendChild(style);

  // Expose a global function to show the widget.
  window.showSerineWidget = function () {
    console.log("showSerineWidget called");
    container.style.display = 'block';
    setTimeout(() => {
      container.classList.add("visible");
      trackEvent('widget_open', { timestamp: new Date().toISOString(), siteID });
      console.log("Widget should now be visible");
    }, 10);
  };

  // Optional: Listen for messages from the parent page (if needed) and track them.
  window.addEventListener("message", (event) => {
    if (event.data.type === "widgetEvent") {
      console.log("Received message from parent page:", event.data);
      trackEvent('widget_message', { data: event.data, timestamp: new Date().toISOString(), siteID });
    }
  });

  console.log("widget.js loaded. window.showSerineWidget =", typeof window.showSerineWidget);
})();
