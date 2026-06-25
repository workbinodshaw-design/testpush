import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import VisitorTracker from './components/VisitorTracker';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import SubmitTool from './pages/SubmitTool';
import ToolDetails from './pages/ToolDetails';
import ContentPage from './pages/ContentPage';
import Dashboard from './pages/Dashboard';
import Compare from './pages/Compare';
import Prompts from './pages/Prompts';
import AIAssistant from './pages/AIAssistant';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import CommandPalette from './components/CommandPalette';
import './styles/globals.css';
import './styles/cards.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <VisitorTracker />
        <div className="app-container">
        <Navbar />
        <CommandPalette />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/categories/:id" element={<ProtectedRoute><CategoryDetails /></ProtectedRoute>} />
            <Route path="/submit" element={<ProtectedRoute><SubmitTool /></ProtectedRoute>} />
            <Route path="/tool/:id" element={<ProtectedRoute><ToolDetails /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
            <Route path="/prompts" element={<ProtectedRoute><Prompts /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            
            {/* Footer Pages - Usually Public */}
            <Route path="/trending" element={<ContentPage pageKey="trending" />} />
            <Route path="/blog" element={<ContentPage pageKey="blog" />} />
            <Route path="/help" element={<ContentPage pageKey="help" />} />
            <Route path="/api" element={<ContentPage pageKey="api" />} />
            <Route path="/community" element={<ContentPage pageKey="community" />} />
            <Route path="/privacy" element={<ContentPage pageKey="privacy" />} />
            <Route path="/terms" element={<ContentPage pageKey="terms" />} />
            <Route path="/cookies" element={<ContentPage pageKey="cookies" />} />
          </Routes>
        </main>
        <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
