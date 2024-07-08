import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Conversations from './pages/Conversations/Conversations';
import ConversationDetails from './pages/Conversations/ConversationDetails';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/conversations/:conversationId" element={<ConversationDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
