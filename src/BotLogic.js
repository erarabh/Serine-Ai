/**
 * BotLogic.js
 *
 * This module encapsulates the logic for sending chat messages to your backend,
 * which then processes the message using multi-tenant and hybrid AI logic.
 *
 * Responsibilities:
 * - Build the payload, including multi-tenant details (clientId, sessionId).
 * - Make a POST request to the /chat API endpoint.
 * - Return the processed response.
 * 
 * Multi-Tenant & Hybrid Considerations:
 * - Each request must include a `clientId` that’s provided in the embed code.
 * - A `sessionId` is passed if available; if not, the backend will generate one.
 * - Hybrid AI logic (manual FAQ override vs. automated answer) is handled on the backend.
 *
 * Note: Make sure that process.env.API_URL is set to your live backend URL from Railway.
 */

export async function sendChatMessage({ clientId, sessionId, message }) {
  // Build the payload with the necessary multi-tenant identifiers.
  const payload = {
    clientId,               // Provided via the embed code on the client's website.
    sessionId: sessionId || null, // For anonymous users; backend generates if null.
    userMessage: message,
  };

  // Construct the API endpoint.
  // This URL should point to your production backend (e.g., Railway-hosted).
  const apiEndpoint = `${process.env.API_URL}/chat`; // e.g., https://your-railway-app.com/chat

  try {
    // Make the API call to the /chat endpoint.
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Handle error cases.
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    // Parse and return the JSON response.
    const data = await response.json();
    return data; // Expecting something like { message: "bot reply", sessionId: "generated-session-id", ... }
  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    throw error;
  }
}
