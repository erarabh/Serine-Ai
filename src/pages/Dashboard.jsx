import React, { useState } from 'react';
import FAQAdmin from '../components/FAQAdmin.jsx';

export default function Dashboard({ user }) {
  // In production, user data would be provided by authentication.
  // Here, we simulate admin access for demonstration.
  const isAdmin = user ? user.isAdmin : true; 
  const [siteID] = useState("CLIENT_ABC123");
  const [websiteURL, setWebsiteURL] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  const handleGenerate = () => {
    const code = `
<script src="https://serine-ai.vercel.app/widget.js" data-siteid="${siteID}" data-border-color="#00AAFF" data-website-url="${websiteURL.trim()}"></script>
    `.trim();
    setEmbedCode(code);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Manage your chatbot widget and website integration.</p>
        </header>

        <section className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Embed Code Generator</h2>
          <div className="mb-4">
            <label htmlFor="website-url" className="block text-gray-700 font-medium mb-2">
              Enter Your Website URL:
            </label>
            <input
              id="website-url"
              type="text"
              value={websiteURL}
              onChange={(e) => setWebsiteURL(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Generate Embed Code
          </button>

          {embedCode && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Your Embed Code:</h3>
              <textarea
                readOnly
                value={embedCode}
                className="w-full p-2 border border-gray-300 rounded"
                rows="5"
              />
              <p className="mt-2 text-sm text-gray-600">
                Copy and paste this snippet into your website to embed the chat widget.
              </p>
            </div>
          )}
        </section>

        {isAdmin && (
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Manage FAQs</h2>
            <FAQAdmin />
          </section>
        )}
      </div>
    </div>
  );
}
