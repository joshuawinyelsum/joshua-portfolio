import { SectionHeader } from '../components/SectionHeader';
import { ExperienceCard } from '../components/ExperienceCard';
import { experience } from '../data/experience';

export function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32 section-padding">
      <div className="max-w-4xl">
        <SectionHeader title="Experience" />
        <div>
          {experience.map((item, index) => (
            <ExperienceCard key={item.company} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
