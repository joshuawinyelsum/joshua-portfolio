import { SectionHeader } from '../components/SectionHeader';
import { ExperienceCard } from '../components/ExperienceCard';
import { experience } from '../data/experience';

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container-content">
        <SectionHeader title="Experience" />
        <ul className="rows -mt-8">
          {experience.map((item, index) => (
            <ExperienceCard key={item.company} item={item} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
