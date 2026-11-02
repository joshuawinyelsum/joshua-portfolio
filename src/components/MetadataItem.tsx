import { ScrollReveal } from './ScrollReveal';

interface MetadataItemProps {
  label: string;
  value: string;
  delay?: number;
}

export function MetadataItem({ label, value, delay = 0 }: MetadataItemProps) {
  return (
    <ScrollReveal delay={delay}>
      <div className="py-4 border-b border-gray-200 dark:border-[#282a32]">
        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 dark:text-neutral-500 mb-1.5">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-[#ededeb]">{value}</p>
      </div>
    </ScrollReveal>
  );
}
