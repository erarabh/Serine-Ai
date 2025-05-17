// File: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatUI from "./ChatUI";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"; // Import the Login component

export default function App() {
  return (
    <Router>
      <main className="bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<ChatUI />} />
          <Route path="/login" element={<Login />} /> {/* Add Login route */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </Router>
  );
}

