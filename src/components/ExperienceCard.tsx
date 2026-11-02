import { ExperienceItem } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface ExperienceCardProps {
  item: ExperienceItem;
  index: number;
}

export function ExperienceCard({ item, index }: ExperienceCardProps) {
  return (
    <ScrollReveal delay={index * 100}>
      <div className="border-t border-gray-300/80 dark:border-[#282a32] pt-7 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-[#ededeb]">{item.company}</h3>
            <p className="text-sm font-semibold tracking-[0.1em] uppercase text-gray-500 dark:text-neutral-400">
              {item.role}
            </p>
          </div>
          {item.technologies.length > 0 && (
            <div className="flex gap-2">
              {item.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-[#282a32] rounded text-gray-500 dark:text-neutral-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="text-[15px] text-gray-600 dark:text-neutral-300 leading-[1.75] max-w-2xl">
          {item.description}
        </p>
      </div>
    </ScrollReveal>
  );
}
