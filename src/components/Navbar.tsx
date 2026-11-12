import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';
import { ArrowLink } from './ui/ArrowLink';
import { Button } from './ui/Button';

const navItems = [
  { label: 'Work', id: 'work' },
  { label: 'Research', id: 'research' },
  { label: 'Building', id: 'building' },
  { label: 'Experience', id: 'experience' },
  { label: 'Leadership', id: 'leadership' },
  { label: 'CV', id: 'cv' },
];

const sectionIds = ['work', 'research', 'building', 'experience', 'leadership', 'contact'];

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-base ease-out ${
          scrolled ? 'bg-canvas/85 py-3 shadow-nav backdrop-blur-md' : 'bg-transparent py-5'
        }`}
      >
        <div className="section-padding">
        <div className="container-content flex items-center justify-between">
          <button
            onClick={() => {
              if (isHome) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
              }
            }}
            className="group whitespace-nowrap text-base font-bold tracking-tight text-ink sm:text-lg"
          >
            Joshua Winyelsum
            <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-lavender opacity-0 transition-opacity duration-fast group-hover:opacity-100" />
          </button>

          {isHome ? (
            <>
              {/* Desktop nav on home */}
              <div className="hidden items-center md:flex lg:gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    aria-current={activeId === item.id ? 'true' : undefined}
                    className="nav-link"
                  >
                    {item.label}
                  </button>
                ))}
                <Button size="sm" icon="arrow" onClick={() => handleNavClick('contact')} className="ml-3 mr-3">
                  Contact
                </Button>
                <ThemeToggle />
              </div>

              {/* Mobile menu controls on home */}
              <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />
                <Button
                  variant="icon"
                  size="sm"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </Button>
              </div>
            </>
          ) : (
            /* Subpage navigation (CV or Case Study) */
            <div className="flex items-center gap-4">
              <ArrowLink to="/" back className="min-h-[44px] !text-ink">
                Home
              </ArrowLink>
              <ThemeToggle />
            </div>
          )}
        </div>
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
