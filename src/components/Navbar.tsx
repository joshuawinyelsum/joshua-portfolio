import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { MobileMenu } from './MobileMenu';

const navItems = [
  { label: 'Work', id: 'work' },
  { label: 'Research', id: 'research' },
  { label: 'Building', id: 'building' },
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
];

const sectionIds = [...navItems.map((item) => item.id), 'contact'];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const activeId = useScrollSpy(isHome ? sectionIds : [], 120);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-[#D9DDE2]/85 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]'
            : 'bg-transparent'
        }`}
      >
        <div
          className={`flex items-center justify-between section-padding transition-all duration-500 ease-out ${
            scrolled ? 'h-14' : 'h-16'
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className={`font-bold text-gray-900 tracking-tight hover:text-gray-700 transition-all duration-300 ${
              scrolled ? 'text-[13px]' : 'text-sm'
            }`}
          >
            Joshua Winyelsum
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase transition-colors duration-200 rounded ${
                  activeId === item.id
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-px bg-gray-900 transition-all duration-300 ease-out ${
                    activeId === item.id
                      ? 'opacity-100 scale-x-100'
                      : 'opacity-0 scale-x-0'
                  }`}
                />
              </button>
            ))}
            <span className="w-px h-4 bg-gray-300 mx-2" />
            <button
              onClick={() => handleNavClick('contact')}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              Contact
              <svg
                className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2.5 -mr-2 text-gray-900 rounded-lg hover:bg-gray-900/5 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        onNavClick={handleNavClick}
      />
    </header>
  );
}
