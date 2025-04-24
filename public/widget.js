<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Serine AI Chat Widget Test</title>
    <style>
      /* Floating Icon Button */
      #chat-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background-color: #007BFF;
        color: #fff;
        border: none;
        border-radius: 50%;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }

      /* Chat Window Container with Colored Border */
      #chat-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: #fff;
        border: 2px solid #007BFF; /* Colored Border */
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        display: none; /* Hidden initially */
      }

      /* Header for Chat Window */
      #chat-widget-header {
        padding: 10px;
        background: #007BFF;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      /* Chat Content Area */
      #chat-widget-body {
        height: calc(100% - 40px); /* Reserve space for header */
        overflow-y: auto;
      }

      /* Close Button Styling */
      #chat-close-btn {
        background: transparent;
        border: none;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <!-- Floating Chat Icon Button -->
    <button id="chat-toggle-btn">&#128172;</button>

    <!-- Chat Window Container -->
    <div id="chat-widget-container">
      <div id="chat-widget-header">
        <span>Serine AI Chatbot</span>
        <button id="chat-close-btn">&times;</button>
      </div>
      <div id="chat-widget-body">
        <!-- widget.js will render the chat content here -->
      </div>
    </div>

    <!-- Load widget.js normally using defer so it loads after the DOM is ready -->
    <script src="https://serine-ai.vercel.app/widget.js" defer></script>

    <script>
      // Wait for widget.js to be available and the DOM to be ready.
      document.addEventListener("DOMContentLoaded", function () {
        // Widget configuration: update the siteId for each client.
        var widgetOptions = {
          siteId: "your-site-id-goes-here", // Replace with your actual client site ID
          container: document.getElementById("chat-widget-body"),
          autoOpen: false // Prevent the widget from opening on its own
        };

        // Check if widget.js loaded and exposes the SerineAIWidget object.
        if (window.SerineAIWidget && typeof window.SerineAIWidget.init === "function") {
          window.SerineAIWidget.init(widgetOptions);
        } else {
          console.error("SerineAIWidget.init is not available. Check that widget.js is working correctly.");
        }
      });

      // Get DOM elements for toggling the chat widget.
      var toggleBtn = document
