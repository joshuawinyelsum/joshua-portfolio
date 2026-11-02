import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { label: 'Work', id: 'work' },
  { label: 'Research', id: 'research' },
  { label: 'Building', id: 'building' },
  { label: 'Experience', id: 'experience' },
  { label: 'CV', id: 'cv' },
];

const sectionIds = ['work', 'research', 'building', 'experience', 'contact'];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!isHome) {
      setActiveId('');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -79% 0px' }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isHome]);

  const handleNavClick = (id: string) => {
    if (id === 'cv') {
      navigate('/cv');
      setMobileMenuOpen(false);
      return;
    }

    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#121316]/90 backdrop-blur-md shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-b border-gray-200/50 dark:border-[#282a32] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <button
            onClick={() => {
              if (isHome) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
              }
            }}
            className="text-lg font-bold tracking-tight text-gray-900 dark:text-[#ededeb] group"
          >
            Joshua Winyelsum
            <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {isHome ? (
            <>
              {/* Desktop nav on home */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase transition-colors duration-200 rounded ${
                      activeId === item.id
                        ? 'text-gray-900 dark:text-white font-semibold'
                        : 'text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-[#ededeb]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => handleNavClick('contact')}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase text-gray-900 dark:text-[#ededeb] hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mr-2"
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
                <div className="w-px h-4 bg-gray-300 dark:bg-[#282a32] mx-1" />
                <ThemeToggle />
              </div>

              {/* Mobile menu controls on home */}
              <div className="flex md:hidden items-center gap-2">
                <ThemeToggle />
                <button
                  className="p-2 -mr-2 text-gray-900 dark:text-[#ededeb] rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            /* Subpage navigation (CV or Case Study) */
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span className="text-gray-400 dark:text-neutral-500">←</span> Home
              </Link>
              <div className="w-px h-4 bg-gray-300 dark:bg-[#282a32]" />
              <ThemeToggle />
            </div>
          )}
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
