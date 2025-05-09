// File: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatUI from './ChatUI';
import Dashboard from './Dashboard';

export default function App() {
  return (
    <Router>
      <main className="bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<ChatUI />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </Router>
  );
}
