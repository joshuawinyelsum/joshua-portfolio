import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useEffect, useState } from 'react';
import { TerminalPreview } from '../components/TerminalPreview';

export function Hero() {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { ref: scrollRef, progress } = useScrollProgress();

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
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
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
              className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 mb-6"
              style={animate(0)}
            >
              Computer Science · UDS Ghana
            </p>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-tight text-gray-900 mb-6"
              style={animate(100)}
            >
              JOSHUA<br/>WINYELSUM
            </h1>

            <div 
              className="pl-4 border-l-[3px] border-gray-900 mb-8"
              style={animate(250)}
            >
              <h2 className="text-[13px] sm:text-sm font-bold tracking-[0.15em] uppercase text-gray-800 leading-relaxed">
                Software & Systems Engineer
                <br />
                Backend Architecture · Database Design · Data Systems
              </h2>
            </div>

            <p 
              className="text-[15px] sm:text-base text-gray-600 leading-[1.8] max-w-lg mb-10"
              style={animate(400)}
            >
              Computer Science student and software engineer focusing on backend architectures, relational data modeling, offline-first systems, and automated testing. Grounded in verifiable implementations, measurable reliability, and clean systems engineering.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-4"
              style={animate(550)}
            >
              <a
                href="#work"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-gray-900 text-white text-[13px] font-semibold tracking-wide rounded-md hover:bg-gray-800 transition-all duration-300 shadow-sm"
              >
                View Selected Work
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 border border-gray-200 text-gray-700 text-[13px] font-semibold tracking-wide rounded-md hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Get in Touch
              </a>
            </div>
          </div>

          {/* Right Column: Engineering Visual */}
          <div 
            className="relative flex justify-center lg:justify-end z-0 mt-8 lg:mt-0"
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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute scale-[1.5] sm:scale-100">
                <circle cx="200" cy="200" r="140" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="200" cy="200" r="80" stroke="#E5E7EB" strokeWidth="1" />
                
                {/* Lines */}
                <path d="M200 60 L200 120" stroke="#D1D5DB" strokeWidth="1.5" />
                <path d="M200 280 L200 340" stroke="#D1D5DB" strokeWidth="1.5" />
                <path d="M60 200 L120 200" stroke="#D1D5DB" strokeWidth="1.5" />
                <path d="M280 200 L340 200" stroke="#D1D5DB" strokeWidth="1.5" />
                <path d="M101 101 L143 143" stroke="#D1D5DB" strokeWidth="1.5" />
                <path d="M299 299 L257 257" stroke="#D1D5DB" strokeWidth="1.5" />

                {/* Nodes */}
                <circle cx="200" cy="60" r="4" fill="#9CA3AF" />
                <circle cx="200" cy="340" r="4" fill="#9CA3AF" />
                <circle cx="60" cy="200" r="4" fill="#9CA3AF" />
                <circle cx="340" cy="200" r="4" fill="#9CA3AF" />
                <circle cx="101" cy="101" r="3" fill="#9CA3AF" />
                <circle cx="299" cy="299" r="3" fill="#9CA3AF" />
                
                <text x="200" y="45" fill="#9CA3AF" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="0.1em">API</text>
                <text x="360" y="203" fill="#9CA3AF" fontSize="10" fontFamily="monospace" textAnchor="start" letterSpacing="0.1em">DATA</text>
                <text x="200" y="360" fill="#9CA3AF" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="0.1em">SYSTEMS</text>
                <text x="40" y="203" fill="#9CA3AF" fontSize="10" fontFamily="monospace" textAnchor="end" letterSpacing="0.1em">TESTS</text>

                {/* Animated Data Pulses */}
                {!reducedMotion && (
                  <>
                    <circle cx="200" cy="60" r="2" fill="#3B82F6">
                      <animate attributeName="cy" values="60;120;60" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="60" cy="200" r="2" fill="#3B82F6">
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
