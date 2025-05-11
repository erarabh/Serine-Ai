import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FAQAdmin = () => {
  const [faqs, setFaqs] = useState([]);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });

  // Fetch FAQs on component mount
  useEffect(() => {
    axios.get('/faq')  // Ensure your backend proxy is set or use the full backend URL.
      .then((res) => setFaqs(res.data))
      .catch((err) => console.error('Error fetching FAQs:', err));
  }, []);

  const addFAQ = () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) return;
    axios.post('/faq', { ...newFAQ, clientId: 'CLIENT_ABC123' })
      .then((res) => {
        setFaqs(prev => [...prev, res.data]);
        setNewFAQ({ question: '', answer: '' });
      })
      .catch((err) => console.error('Error adding FAQ:', err));
  };

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-gray-200">
        {faqs.map((faq) => (
          <li key={faq.id} className="py-4">
            <p className="font-medium text-gray-800">
              <span className="font-bold">Q:</span> {faq.question}
            </p>
            <p className="text-gray-600">
              <span className="font-bold">A:</span> {faq.answer}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">Add New FAQ</h3>
        <input
          type="text"
          placeholder="Question"
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newFAQ.question}
          onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
        />
        <input
          type="text"
          placeholder="Answer"
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newFAQ.answer}
          onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
        />
        <button
          onClick={addFAQ}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add FAQ
        </button>
      </div>
    </div>
  );
};

export default FAQAdmin;
