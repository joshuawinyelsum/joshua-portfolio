import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function ContextualNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getBreadcrumbs = () => {
    if (location.pathname === '/') {
      return { current: 'HOME', items: ['PROJECTS', 'RESEARCH', 'EXPERIENCE', 'CV'] };
    }
    if (location.pathname === '/cv') {
      return { current: 'CV', items: ['HOME', 'PROJECTS', 'RESEARCH', 'EXPERIENCE'] };
    }
    if (location.pathname.startsWith('/case-study/')) {
      const parts = location.pathname.split('/');
      const slug = parts[parts.length - 1].toUpperCase();
      return { current: `PROJECT / ${slug}`, items: ['HOME', 'CV', 'RESEARCH'] };
    }
    return { current: 'PORTFOLIO', items: ['HOME', 'CV'] };
  };

  const { current, items } = getBreadcrumbs();

  const getLinkFor = (item: string) => {
    switch (item) {
      case 'HOME': return '/';
      case 'CV': return '/cv';
      case 'PROJECTS': return '/#work';
      case 'RESEARCH': return '/#research';
      case 'EXPERIENCE': return '/#experience';
      default: return '/';
    }
  };

  if (!scrolled && location.pathname === '/') return null;

  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center group pointer-events-none"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div 
        className={`pointer-events-auto bg-white/90 dark:bg-[#1a1c22]/90 backdrop-blur-xl border border-gray-200/50 dark:border-[#2a2d36] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-full overflow-hidden transition-all duration-300 ease-out flex items-center justify-center p-1.5 ${
          expanded ? 'w-[320px] md:w-[420px]' : 'w-auto px-4'
        }`}
      >
        {!expanded ? (
          <div className="flex items-center gap-2 py-1 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-[#ededeb] animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-[#ededeb]">{current}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-2 py-1 gap-2 animate-in fade-in zoom-in-95 duration-200">
            {[current, ...items].slice(0, 4).map((item, i) => {
              const link = getLinkFor(item);
              const isHash = link.includes('#');
              
              return (
                <div key={item} className="flex items-center gap-2">
                  {isHash ? (
                    <a
                      href={link}
                      onClick={() => setExpanded(false)}
                      className={`text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                        item === current
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-[#ededeb]'
                      }`}
                    >
                      {item === current && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                      <span>{item}</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setExpanded(false);
                        if (link === '/') {
                          if (location.pathname === '/') {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          } else {
                            navigate('/');
                            setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
                            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                          }
                        } else {
                          navigate(link);
                        }
                      }}
                      className={`text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                        item === current
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-[#ededeb]'
                      }`}
                    >
                      {item === current && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                      <span>{item}</span>
                    </button>
                  )}
                  {i < 3 && <span className="text-gray-200 dark:text-neutral-700 text-[10px]">/</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
