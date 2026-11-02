import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { CaseStudy } from './pages/CaseStudy';
import { CV } from './pages/CV';
import { CommandCenter } from './components/CommandCenter';
import { ContextualNav } from './components/ContextualNav';
import { CommandCenterProvider, useCommandCenter } from './contexts/CommandCenterContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { toggle, isOpen, close } = useCommandCenter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  return (
    <BrowserRouter>
      {/* Skip to content link for accessibility */}
      <a href="#hero" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/case-study/:id" element={<CaseStudy />} />
      </Routes>
      <ContextualNav />
      <CommandCenter isOpen={isOpen} onClose={close} />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CommandCenterProvider>
        <AppContent />
      </CommandCenterProvider>
    </ThemeProvider>
  );
}
