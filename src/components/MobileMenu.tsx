import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Button } from './ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { label: string; id: string }[];
  onNavClick: (id: string) => void;
}

export function MobileMenu({ isOpen, onClose, navItems, onNavClick }: MobileMenuProps) {
  const reducedMotion = useReducedMotion();

  // Prevent background scrolling while menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const itemTransition = (order: number) =>
    reducedMotion
      ? 'none'
      : `opacity var(--duration-slow) var(--ease-out) ${order * 50 + 80}ms, transform var(--duration-slow) var(--ease-out) ${order * 50 + 80}ms`;

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col bg-canvas pt-[env(safe-area-inset-top,0px)] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] ${
        reducedMotion ? '' : 'transition-opacity duration-base ease-out'
      } ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-label="Navigation menu"
    >
      {/* Header */}
      <div className="flex h-[4.5rem] items-center justify-between section-padding">
        <span className="text-base font-bold tracking-tight text-ink">Joshua Winyelsum</span>
        <Button variant="icon" size="sm" onClick={onClose} aria-label="Close menu">
          <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </Button>
      </div>

      {/* Nav items */}
      <div className="flex flex-1 flex-col justify-center gap-1 section-padding">
        {navItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onNavClick(item.id)}
            className="py-3 text-left text-3xl font-bold tracking-tight text-ink transition-colors duration-fast hover:text-accent active:text-accent"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'none' : 'translateY(12px)',
              transition: itemTransition(i),
            }}
          >
            {item.label}
          </button>
        ))}

        <div
          className="mt-8"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'none' : 'translateY(12px)',
            transition: itemTransition(navItems.length),
          }}
        >
          <Button size="lg" icon="arrow" spread block onClick={() => onNavClick('contact')}>
            Contact
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="section-padding pb-6">
        <p className="text-caption tracking-wide text-ink-muted">
          Software & Systems Engineer · Backend & Data Systems
        </p>
      </div>
    </div>
  );
}
