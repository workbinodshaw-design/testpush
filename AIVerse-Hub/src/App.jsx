import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import SubmitTool from './pages/SubmitTool';
import ToolDetails from './pages/ToolDetails';
import ContentPage from './pages/ContentPage';
import './styles/globals.css';
import './styles/cards.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryDetails />} />
          <Route path="/submit" element={<SubmitTool />} />
          <Route path="/tool/:id" element={<ToolDetails />} />
          
          {/* New Footer Pages */}
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
    </Router>
  );
}

export default App;
