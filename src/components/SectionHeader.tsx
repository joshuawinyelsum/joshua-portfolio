import { ScrollReveal } from './ScrollReveal';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}

export function SectionHeader({ title, subtitle, align = 'left', dark = false }: SectionHeaderProps) {
  return (
    <ScrollReveal className={`mb-16 md:mb-20 ${align === 'center' ? 'text-center' : ''}`}>
      <div className="flex items-center gap-4 mb-5">
        <h2
          className={`text-[11px] font-bold tracking-[0.25em] uppercase ${
            dark ? 'text-gray-500' : 'text-gray-400 dark:text-neutral-500'
          }`}
        >
          {title}
        </h2>
        <div
          className={`flex-1 h-px max-w-[60px] ${
            dark ? 'bg-gray-700' : 'bg-gray-300 dark:bg-[#282a32]'
          }`}
        />
      </div>
      {subtitle && (
        <p
          className={`text-xl md:text-2xl lg:text-[1.7rem] font-semibold max-w-2xl leading-snug ${
            align === 'center' ? 'mx-auto' : ''
          } ${dark ? 'text-gray-200' : 'text-gray-800 dark:text-[#ededeb]'}`}
        >
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
