import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useEffect, useState } from 'react';

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
          transform: mounted ? 'none' : 'translateY(24px)',
          transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        };

  // Scroll-linked transforms (only when reduced motion is off)
  const scrollFactor = reducedMotion ? 0 : Math.min(progress * 2.5, 1);
  const nameScale = 1 - scrollFactor * 0.12;
  const nameOpacity = 1 - scrollFactor * 0.4;
  const contentTranslate = scrollFactor * -30;
  const contentOpacity = 1 - scrollFactor * 0.6;

  return (
    <section
      ref={scrollRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center section-padding pt-24 pb-20 overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.6 - scrollFactor * 0.6,
        }}
      />

      <div className="relative max-w-5xl">
        {/* Eyebrow */}
        <p
          className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-gray-500 mb-8 md:mb-10"
          style={{
            ...animate(0),
            ...(mounted && !reducedMotion
              ? {
                  opacity: contentOpacity,
                  transform: `translateY(${contentTranslate}px)`,
                  transition: 'none',
                }
              : {}),
          }}
        >
          <span className="hidden md:inline">Computer Science · UDS · Tamale, Ghana</span>
          <span className="md:hidden">
            Computer Science · UDS
            <br />
            Tamale, Ghana
          </span>
        </p>

        {/* Name — the dominant visual element */}
        <h1
          className="mb-8 md:mb-10 will-change-transform"
          style={
            mounted && !reducedMotion
              ? {
                  transform: `scale(${nameScale})`,
                  opacity: nameOpacity,
                  transformOrigin: 'left top',
                }
              : {}
          }
        >
          <span
            className="block text-[clamp(3.2rem,11vw,10rem)] font-extrabold leading-[0.88] tracking-[-0.04em] text-gray-900"
            style={animate(100)}
          >
            JOSHUA
          </span>
          <span
            className="block text-[clamp(3.2rem,11vw,10rem)] font-extrabold leading-[0.88] tracking-[-0.04em] text-gray-900"
            style={animate(250)}
          >
            WINYELSUM
          </span>
        </h1>

        {/* Titles — with a subtle left accent */}
        <div
          className="mb-10 md:mb-12 pl-1 border-l-2 border-gray-400/40"
          style={{
            ...animate(450),
            ...(mounted && !reducedMotion
              ? {
                  opacity: contentOpacity,
                  transform: `translateY(${contentTranslate * 0.7}px)`,
                  transition: 'none',
                }
              : {}),
          }}
        >
          <div className="pl-4">
            <p className="text-[11px] md:text-xs font-semibold tracking-[0.18em] uppercase text-gray-500 leading-loose">
              <span className="hidden md:block">
                Systems Engineer · Backend Engineer · Machine Learning Engineer
                <br />
                AI & Data Systems Researcher · Data Systems Builder
              </span>
              <span className="md:hidden flex flex-col gap-0.5">
                <span>Systems Engineer</span>
                <span>Backend Engineer</span>
                <span>Machine Learning Engineer</span>
                <span>AI & Data Systems Researcher</span>
                <span>Data Systems Builder</span>
              </span>
            </p>
          </div>
        </div>

        {/* Descriptions */}
        <div
          className="space-y-4 mb-12 md:mb-14 max-w-2xl"
          style={{
            ...animate(600),
            ...(mounted && !reducedMotion
              ? {
                  opacity: contentOpacity,
                  transform: `translateY(${contentTranslate * 0.5}px)`,
                  transition: 'none',
                }
              : {}),
          }}
        >
          <p className="text-base md:text-lg text-gray-800 leading-relaxed font-medium">
            He builds software, data systems, and intelligent technology for real-world problems.
          </p>
          <p className="text-sm md:text-[15px] text-gray-600 leading-[1.75]">
            He started teaching himself programming during the COVID-19 lockdowns before receiving
            any formal Computer Science instruction, and is now studying Computer Science at the
            University for Development Studies in Tamale, Ghana.
          </p>
          <p className="text-sm md:text-[15px] text-gray-600 leading-[1.75]">
            Currently exploring backend engineering, machine learning, computer vision, and data
            systems—with a particular interest in fragmented data and technology for agriculture.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 mb-20 md:mb-24"
          style={{
            ...animate(750),
            ...(mounted && !reducedMotion
              ? {
                  opacity: contentOpacity,
                  transform: `translateY(${contentTranslate * 0.3}px)`,
                  transition: 'none',
                }
              : {}),
          }}
        >
          <a
            href="#work"
            className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/10"
          >
            View Selected Work
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#about"
            className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 border border-gray-400/60 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-600 hover:text-gray-900 transition-all duration-300"
          >
            About Joshua
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className="flex items-center gap-2.5 text-[11px] font-medium text-gray-400 tracking-wider uppercase"
          style={{
            ...animate(950),
            ...(mounted && !reducedMotion
              ? { opacity: Math.max(0, 1 - scrollFactor * 3) }
              : {}),
          }}
        >
          <span>Scroll to explore</span>
          <svg
            className="w-3.5 h-3.5 animate-[bounce_2s_ease-in-out_infinite]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
