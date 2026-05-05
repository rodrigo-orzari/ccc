import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MethodologyPage from './pages/Methodology';
import AboutPage from './pages/About';
import SupportPage from './pages/Support';
import PrivacyPolicyPage from './pages/PrivacyPolicy';
import TermsOfUsePage from './pages/TermsOfUse';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfUsePage />} />
      </Routes>
    </Router>
  );
}
