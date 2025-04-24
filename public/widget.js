<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Serine AI Chat Widget Example</title>
    <style>
      /* Style for the floating icon button */
      #chat-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #007BFF; /* Change as needed */
        color: #fff;
        border: none;
        cursor: pointer;
        font-size: 28px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: block; /* Ensure it is visible at first */
      }
      
      /* The chat window container with a colored border */
      #chat-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        height: 500px;
        display: none; /* Initially hidden */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: 2px solid #007BFF;  /* Colored border */
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        z-index: 1001;
      }
      
      /* Header for the chat widget window */
      #chat-widget-header {
        background-color: #007BFF;
        color: #fff;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      /* Chat widget content area */
      #chat-widget-body {
        height: calc(100% - 40px); /* Adjust for header height */
        overflow-y: auto;
      }
      
      /* Close button styling */
      #chat-close-btn {
        background: transparent;
        color: #fff;
        border: none;
        font-size: 18px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <!-- Floating chat icon button -->
    <button id="chat-toggle-btn">&#128172;</button>
    
    <!-- Chat widget container (remains hidden until the icon is clicked) -->
    <div id="chat-widget-container">
      <div id="chat-widget-header">
        <span>Serine AI Chatbot</span>
        <button id="chat-close-btn">&times;</button>
      </div>
      <div id="chat-widget-body">
        <!-- The widget.js file will load the chat content here -->
      </div>
    </div>
    
    <!-- Load your widget.js file -->
    <script src="https://serine-ai.vercel.app/widget.js"></script>
    <script>
      // Widget configuration options
      var widgetOptions = {
        siteId: "your-site-id-goes-here", // Replace with the actual site id
        container: document.getElementById("chat-widget-body"),
        autoOpen: false, // Ensures the widget does not open automatically on load
        // Add additional options as needed
      };
      
      // Initialize the widget if available
      if (typeof SerineAIWidget !== "undefined" && typeof SerineAIWidget.init === "function") {
        SerineAIWidget.init(widgetOptions);
      } else {
        console.error("SerineAIWidget or its init function is not defined. Please check your widget.js file.");
      }
      
      // Toggle logic for opening and closing the chat window
      var toggleBtn = document.getElementById("chat-toggle-btn");
      var widgetContainer = document.getElementById("chat-widget-container");
      var closeBtn = document.getElementById("chat-close-btn");
      
      // When the floating icon is clicked: show the chat window and hide the icon.
      toggleBtn.addEventListener("click", function() {
        widgetContainer.style.display = "block";
        toggleBtn.style.display = "none";
      });
      
      // When the close button is clicked: hide the chat window and show the icon.
      closeBtn.addEventListener("click", function() {
        widgetContainer.style.display = "none";
        toggleBtn.style.display = "block";
      });
    </script>
  </body>
</html>
