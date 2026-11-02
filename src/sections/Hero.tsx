import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useEffect, useState } from 'react';
import { TerminalPreview } from '../components/TerminalPreview';
import { useTheme } from '../contexts/ThemeContext';

export function Hero() {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { ref: scrollRef, progress } = useScrollProgress();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const animate = (delay: number) =>
    reducedMotion
      ? {}
      : {
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(16px)',
          transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        };

  const scrollFactor = reducedMotion ? 0 : Math.min(progress * 2.5, 1);
  const contentTranslate = scrollFactor * -30;
  const contentOpacity = 1 - scrollFactor * 0.6;

  return (
    <section
      ref={scrollRef}
      id="hero"
      className="relative min-h-screen flex items-center section-padding pt-32 pb-20 overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.8 - scrollFactor * 0.6,
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Identity */}
          <div 
            className="flex flex-col z-10"
            style={{
              ...(mounted && !reducedMotion
                ? {
                    opacity: contentOpacity,
                    transform: `translateY(${contentTranslate}px)`,
                    transition: 'none',
                  }
                : {}),
            }}
          >
            <p
              className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-6"
              style={animate(0)}
            >
              Computer Science · UDS Ghana
            </p>

            <h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight break-words text-gray-900 dark:text-[#ededeb] mb-6"
              style={animate(100)}
            >
              JOSHUA<br/>WINYELSUM
            </h1>

            <div 
              className="pl-4 border-l-[3px] border-gray-900 dark:border-[#ededeb] mb-8"
              style={animate(250)}
            >
              <h2 className="text-[13px] sm:text-sm font-bold tracking-[0.15em] uppercase text-gray-800 dark:text-neutral-300 leading-relaxed">
                Software & Systems Engineer
                <br />
                Backend Architecture · Database Design · Data Systems
              </h2>
            </div>

            <p 
              className="text-[15px] sm:text-base text-gray-600 dark:text-neutral-400 leading-[1.8] max-w-lg mb-10"
              style={animate(400)}
            >
              Computer Science student and software engineer focusing on backend architectures, relational data modeling, offline-first systems, and automated testing. Grounded in verifiable implementations, measurable reliability, and clean systems engineering.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
              style={animate(550)}
            >
              <a
                href="#work"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-[44px] bg-gray-900 text-white dark:bg-[#ededeb] dark:text-[#121316] text-[13px] font-semibold tracking-wide rounded-md hover:bg-gray-800 dark:hover:bg-white transition-all duration-300 shadow-sm"
              >
                View Selected Work
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-[44px] border border-gray-200 dark:border-[#2c2f38] text-gray-700 dark:text-neutral-300 text-[13px] font-semibold tracking-wide rounded-md hover:border-gray-300 dark:hover:border-neutral-500 hover:bg-gray-50 dark:hover:bg-[#1a1c22] transition-all duration-300"
              >
                Get in Touch
              </a>
            </div>
          </div>

          {/* Right Column: Engineering Visual */}
          <div 
            className="relative flex justify-center lg:justify-end z-0 mt-8 lg:mt-0 max-w-full overflow-hidden"
            style={{
              ...animate(700),
              ...(mounted && !reducedMotion
                ? {
                    opacity: contentOpacity,
                    transform: `translateY(${contentTranslate * 0.4}px)`,
                    transition: 'none',
                  }
                : {}),
            }}
          >
            {/* Abstract Node Architecture Graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute scale-100 max-w-full">
                <circle cx="200" cy="200" r="140" stroke={isDark ? '#2a2d36' : '#E5E7EB'} strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="200" cy="200" r="80" stroke={isDark ? '#2a2d36' : '#E5E7EB'} strokeWidth="1" />
                
                {/* Lines */}
                <path d="M200 60 L200 120" stroke={isDark ? '#353945' : '#D1D5DB'} strokeWidth="1.5" />
                <path d="M200 280 L200 340" stroke={isDark ? '#353945' : '#D1D5DB'} strokeWidth="1.5" />
                <path d="M60 200 L120 200" stroke={isDark ? '#353945' : '#D1D5DB'} strokeWidth="1.5" />
                <path d="M280 200 L340 200" stroke={isDark ? '#353945' : '#D1D5DB'} strokeWidth="1.5" />
                <path d="M101 101 L143 143" stroke={isDark ? '#353945' : '#D1D5DB'} strokeWidth="1.5" />
                <path d="M299 299 L257 257" stroke={isDark ? '#353945' : '#D1D5DB'} strokeWidth="1.5" />

                {/* Nodes */}
                <circle cx="200" cy="60" r="4" fill={isDark ? '#6b7280' : '#9CA3AF'} />
                <circle cx="200" cy="340" r="4" fill={isDark ? '#6b7280' : '#9CA3AF'} />
                <circle cx="60" cy="200" r="4" fill={isDark ? '#6b7280' : '#9CA3AF'} />
                <circle cx="340" cy="200" r="4" fill={isDark ? '#6b7280' : '#9CA3AF'} />
                <circle cx="101" cy="101" r="3" fill={isDark ? '#6b7280' : '#9CA3AF'} />
                <circle cx="299" cy="299" r="3" fill={isDark ? '#6b7280' : '#9CA3AF'} />
                
                <text x="200" y="45" fill={isDark ? '#808796' : '#9CA3AF'} fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="0.1em">API</text>
                <text x="360" y="203" fill={isDark ? '#808796' : '#9CA3AF'} fontSize="10" fontFamily="monospace" textAnchor="start" letterSpacing="0.1em">DATA</text>
                <text x="200" y="360" fill={isDark ? '#808796' : '#9CA3AF'} fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="0.1em">SYSTEMS</text>
                <text x="40" y="203" fill={isDark ? '#808796' : '#9CA3AF'} fontSize="10" fontFamily="monospace" textAnchor="end" letterSpacing="0.1em">TESTS</text>

                {/* Animated Data Pulses */}
                {!reducedMotion && (
                  <>
                    <circle cx="200" cy="60" r="2" fill={isDark ? '#60A5FA' : '#3B82F6'}>
                      <animate attributeName="cy" values="60;120;60" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="60" cy="200" r="2" fill={isDark ? '#60A5FA' : '#3B82F6'}>
                      <animate attributeName="cx" values="60;120;60" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </svg>
            </div>

            <div className="relative w-full max-w-md">
              <TerminalPreview />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
