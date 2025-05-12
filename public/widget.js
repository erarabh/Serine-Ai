(() => {
  const currentScript = document.currentScript;
  const siteID = currentScript?.getAttribute("data-siteid") || "default-site";
  const borderColor =
    currentScript?.getAttribute("data-border-color") || "#007BFF"; // default blue

  if (!siteID) {
    console.error("Widget: Missing data-siteid attribute");
    return;
  }

  function trackEvent(eventName, data) {
    console.log(`Tracking event: ${eventName}`, data);
  }

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
  container.style.display = "block";

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
      container.style.display = "none";
      if (typeof window.onWidgetClose === "function") {
        window.onWidgetClose();
      }
    }, 300);
  };

  const iframe = document.createElement("iframe");
  iframe.src = `https://serine-ai.vercel.app/?siteid=${siteID}`;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  container.appendChild(closeBtn);
  container.appendChild(iframe);
  document.body.appendChild(container);

  const style = document.createElement("style");
  style.innerHTML = `
    #serine-widget.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
      pointer-events: auto !important;
      display: block !important;
    }
  `;
  document.head.appendChild(style);

  window.showSerineWidget = function () {
    console.log("showSerineWidget called");
    container.style.display = "block";
    setTimeout(() => {
      container.classList.add("visible");
      trackEvent("widget_open", {
        timestamp: new Date().toISOString(),
        siteID,
      });
      console.log("Widget should now be visible");
    }, 10);
  };

  window.addEventListener("message", (event) => {
    if (event.data.type === "widgetEvent") {
      console.log("Received message from parent page:", event.data);
      trackEvent("widget_message", {
        data: event.data,
        timestamp: new Date().toISOString(),
        siteID,
      });
    }
  });

  console.log(
    "widget.js loaded. window.showSerineWidget =",
    typeof window.showSerineWidget
  );
  // Ensure widget.js automatically initializes the chatbot on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Auto-initializing Serine AI widget...");
  if (typeof window.showSerineWidget === "function") {
    window.showSerineWidget();
  } else {
    console.error("❌ window.showSerineWidget is not available.");
  }
});

})();
