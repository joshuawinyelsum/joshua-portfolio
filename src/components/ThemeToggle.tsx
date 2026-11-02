import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isDark
          ? 'bg-[#1c1e24] border-[#2c2f38] text-[#ededeb] hover:bg-[#252830] hover:border-neutral-600 focus-visible:ring-neutral-400 focus-visible:ring-offset-[#121316]'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 focus-visible:ring-gray-900 focus-visible:ring-offset-white'
      } ${className}`}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className="sr-only">Toggle theme</span>

      {/* Sun Icon (shown when dark to toggle to light) */}
      <svg
        className={`w-4 h-4 transition-all duration-300 ease-out ${
          isDark
            ? 'rotate-0 scale-100 opacity-100 text-amber-300'
            : '-rotate-90 scale-0 opacity-0 absolute'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>

      {/* Moon Icon (shown when light to toggle to dark) */}
      <svg
        className={`w-4 h-4 transition-all duration-300 ease-out ${
          !isDark
            ? 'rotate-0 scale-100 opacity-100 text-gray-700'
            : 'rotate-90 scale-0 opacity-0 absolute'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  );
}
