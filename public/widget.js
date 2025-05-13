(() => {
  const currentScript = document.currentScript;
  const siteID = currentScript?.getAttribute("data-siteid") || "default-site";
  const borderColor = currentScript?.getAttribute("data-border-color") || "#007BFF";

  if (!siteID) {
    console.error("Widget: Missing data-siteid attribute");
    return;
  }

  function trackEvent(eventName, data) {
    console.log(`Tracking event: ${eventName}`, data);
  }

  // Create widget container
  const container = document.createElement("div");
  container.id = "serine-widget";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.height = "400px";
  container.style.backgroundColor = "#fff";
  container.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  container.style.borderRadius = "10px";
  container.style.overflow = "hidden";
  container.style.zIndex = "1000";
  container.style.border = `4px solid ${borderColor}`;
  container.style.opacity = "0";
  container.style.transform = "translateY(50px)";
  container.style.pointerEvents = "none";
  container.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  container.style.display = "none"; // Set initially to "none" so it doesn't appear immediately

  // Resize handling
  function updateContainerStyle() {
    if (window.innerWidth < 640) {
      container.style.width = "90%";
      container.style.right = "5%";
      container.style.left = "5%";
    } else {
      container.style.width = "300px";
      container.style.right = "20px";
      container.style.left = "";
    }
  }
  updateContainerStyle();
  window.addEventListener("resize", updateContainerStyle);

  // Create close button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "5px";
  closeBtn.style.right = "5px";
  closeBtn.style.backgroundColor = "red";
  closeBtn.style.color = "white";
  closeBtn.style.border = "none";
  closeBtn.style.padding = "5px";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = () => {
    container.classList.remove("visible");
    trackEvent("widget_close", { timestamp: new Date().toISOString(), siteID });
    setTimeout(() => {
      container.style.display = "none"; // Hide chat window
      widgetIcon.style.display = "block"; // Show widget icon again
      if (typeof window.onWidgetClose === "function") {
        window.onWidgetClose();
      }
    }, 300);
  };

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = `https://serine-ai.vercel.app/?siteid=${siteID}`;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  // Add elements to widget container
  container.appendChild(closeBtn);
  container.appendChild(iframe);
  document.body.appendChild(container);

  // Create widget icon (button to reopen)
  const widgetIcon = document.createElement("div");
  widgetIcon.id = "serine-widget-icon";
  widgetIcon.innerText = "💬";
  widgetIcon.style.position = "fixed";
  widgetIcon.style.bottom = "20px";
  widgetIcon.style.right = "20px";
  widgetIcon.style.width = "50px";
  widgetIcon.style.height = "50px";
  widgetIcon.style.lineHeight = "50px";
  widgetIcon.style.textAlign = "center";
  widgetIcon.style.fontSize = "24px";
  widgetIcon.style.backgroundColor = borderColor;
  widgetIcon.style.color = "white";
  widgetIcon.style.borderRadius = "50%";
  widgetIcon.style.cursor = "pointer";
  widgetIcon.style.display = "block"; // Ensure visible when loaded
  widgetIcon.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  widgetIcon.onclick = () => {
    showSerineWidget();
  };

  document.body.appendChild(widgetIcon);

  // Apply styles for widget visibility
  const style = document.createElement("style");
  style.innerHTML = `
    #serine-widget.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
      pointer-events: auto !important;
      display: block !important;
    }
    #serine-widget-icon:hover {
      background-color: #0056b3;
    }
  `;
  document.head.appendChild(style);

  // Function to show the widget
  window.showSerineWidget = function () {
    console.log("showSerineWidget called");
    container.style.display = "block"; // Show widget
    widgetIcon.style.display = "none"; // Hide icon
    setTimeout(() => {
      container.classList.add("visible");
      trackEvent("widget_open", {
        timestamp: new Date().toISOString(),
        siteID,
      });
      console.log("Widget should now be visible");
    }, 10);
  };

  // Auto-initialize on page load
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Auto-initializing Serine AI widget...");
    if (typeof window.showSerineWidget === "function") {
      showSerineWidget(); // Automatically open widget
    } else {
      console.error("❌ window.showSerineWidget is not available.");
    }
  });

  console.log("widget.js loaded. window.showSerineWidget =", typeof window.showSerineWidget);
})();
