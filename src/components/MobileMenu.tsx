import { useReducedMotion } from '../hooks/useReducedMotion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { label: string; id: string }[];
  onNavClick: (id: string) => void;
}

export function MobileMenu({ isOpen, onClose, navItems, onNavClick }: MobileMenuProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`fixed inset-0 z-[60] bg-[#D9DDE2] dark:bg-[#121316] flex flex-col ${
        reducedMotion ? '' : 'transition-all duration-300 ease-out'
      } ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-label="Navigation menu"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-300/40 dark:border-[#282a32]">
        <span className="text-sm font-bold text-gray-900 dark:text-[#ededeb] tracking-tight">
          Joshua Winyelsum
        </span>
        <button
          onClick={onClose}
          className="p-2.5 -mr-2 text-gray-900 dark:text-[#ededeb] rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 flex flex-col justify-center px-8 gap-2">
        {navItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onNavClick(item.id)}
            className="text-left py-3 text-3xl font-bold text-gray-900 dark:text-[#ededeb] tracking-tight hover:text-gray-600 dark:hover:text-neutral-400 transition-colors active:text-gray-500"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'none' : 'translateY(12px)',
              transition: reducedMotion
                ? 'none'
                : `opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${i * 50 + 80}ms, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${i * 50 + 80}ms`,
            }}
          >
            {item.label}
          </button>
        ))}

        <div className="w-12 h-px bg-gray-300 dark:bg-[#282a32] my-3" />

        <button
          onClick={() => onNavClick('contact')}
          className="text-left py-3 text-3xl font-bold text-gray-900 dark:text-[#ededeb] tracking-tight hover:text-gray-600 dark:hover:text-neutral-400 transition-colors flex items-center gap-3 active:text-gray-500"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'none' : 'translateY(12px)',
            transition: reducedMotion
              ? 'none'
              : `opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${navItems.length * 50 + 80}ms, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${navItems.length * 50 + 80}ms`,
          }}
        >
          Contact
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <div className="px-8 pb-8">
        <p className="text-xs text-gray-400 dark:text-neutral-500 tracking-wide">
          Software & Systems Engineer · Backend & Data Systems
        </p>
      </div>
    </div>
  );
}
