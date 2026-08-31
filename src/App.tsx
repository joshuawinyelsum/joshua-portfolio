import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { CaseStudy } from './pages/CaseStudy';

export default function App() {
  return (
    <BrowserRouter>
      {/* Skip to content link for accessibility */}
      <a href="#hero" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/case-study/:id" element={<CaseStudy />} />
      </Routes>
    </BrowserRouter>
  );
}
