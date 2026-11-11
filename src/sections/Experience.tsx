import { SectionHeader } from '../components/SectionHeader';
import { ExperienceCard } from '../components/ExperienceCard';
import { experience } from '../data/experience';

export function Experience() {
  return (
    <section id="experience" className="section pb-24 sm:pb-28">
      <div className="container-content">
        <SectionHeader
          title="Experience"
          subtitle="Engineering contributions, hackathons, and professional roles."
          accent="professional roles."
        />
        <ul className="space-y-6 p-0">
          {experience.map((item, index) => (
            <ExperienceCard key={item.company} item={item} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
