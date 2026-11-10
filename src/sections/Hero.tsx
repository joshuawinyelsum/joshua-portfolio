import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { TerminalPreview } from '../components/TerminalPreview';
import { ProjectPreview } from '../components/projects/ProjectPreview';
import { Button } from '../components/ui/Button';

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Staggered entrance using the shared reveal motion.
  const enter = (delay: number) => ({
    className: `reveal ${mounted ? 'is-visible' : ''}`,
    style: { '--reveal-delay': `${delay}ms` } as CSSProperties,
  });

  return (
    <section id="hero" className="relative section-padding pb-16 pt-32 lg:flex lg:min-h-screen lg:items-center lg:pb-20 lg:pt-28">
      <div className="container-content grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12">
        {/* Identity */}
        <div className="flex flex-col items-start">
          <div {...enter(0)}>
            <p className="eyebrow">Computer Science · UDS Ghana</p>
          </div>

          <div {...enter(90)}>
            <h1 className="mt-6 break-words text-display font-extrabold text-ink">
              JOSHUA
              <br />
              WINYELSUM
            </h1>
          </div>

          <div {...enter(200)}>
            <h2 className="mt-7 text-small font-semibold uppercase tracking-[0.12em] text-ink">
              Software & Systems Engineer
              <span className="mt-1 block font-medium text-ink-muted">
                Backend Architecture · Database Design · Data Systems
              </span>
            </h2>
          </div>

          <div {...enter(320)}>
            <p className="mt-6 max-w-lg text-lead text-ink-soft">
              Computer Science student and software engineer focusing on backend architectures, relational data
              modeling, offline-first systems, and automated testing. Grounded in verifiable implementations,
              measurable reliability, and clean systems engineering.
            </p>
          </div>

          <div {...enter(440)} className={`${enter(440).className} w-full sm:w-auto`}>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-5">
              <Button href="#work" size="lg" icon="arrow" spread className="w-full sm:w-auto">
                View Selected Work
              </Button>
              <Button href="#contact" size="lg" variant="secondary" className="w-full sm:w-auto">
                Get in Touch
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive terminal, presented on the layered preview sheets */}
        <div {...enter(560)}>
          <ProjectPreview interactive className="mx-auto max-w-md lg:ml-auto lg:mr-[var(--layer-offset-lg)]">
            <TerminalPreview />
          </ProjectPreview>
        </div>
      </div>
    </section>
  );
}
