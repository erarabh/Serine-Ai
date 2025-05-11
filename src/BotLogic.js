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
  // Modify payload to include a "messages" array
  const payload = {
    clientId,
    sessionId: sessionId || null,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  };

  // Use your production backend URL from the environment variable
  const apiEndpoint = `${process.env.VITE_API_URL}/chat`;

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data; // Expected to be like { message: "bot reply", sessionId: "new-session-id", ... }
  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    throw error;
  }
}
