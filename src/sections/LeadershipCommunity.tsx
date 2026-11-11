import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { LeadershipEntry } from '../components/leadership/LeadershipEntry';
import { CampusAppointment } from '../components/leadership/CampusAppointment';
import { CreativePracticeItem } from '../components/leadership/CreativePracticeItem';
import { ArrowLink } from '../components/ui/ArrowLink';
import {
  communityLeadership,
  campusLeadership,
  creativePractices,
} from '../data/leadership';

export function LeadershipCommunity() {
  return (
    <section id="leadership" className="section">
      <div className="container-content space-y-16">
        {/* Section Header */}
        <SectionHeader
          title="Leadership & Community"
          subtitle="Community initiative, campus leadership, and creative practice."
          accent="creative practice."
        />

        {/* Primary Leadership Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 items-start">
          <ScrollReveal delay={50} className="h-full">
            <LeadershipEntry entry={communityLeadership} />
          </ScrollReveal>

          <ScrollReveal delay={120} className="h-full">
            <CampusAppointment entry={campusLeadership} />
          </ScrollReveal>
        </div>

        {/* Cross-reference to UNICEF StartUp Lab (Collaborative Engineering) */}
        <ScrollReveal delay={180}>
          <div className="rounded-control bg-sunken p-5 text-small text-ink-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="font-semibold text-ink">Collaborative Engineering:</span>
              <span className="ml-1.5">
                Full-stack and interface engineering for MABIA AI through the UNICEF StartUp Lab hackathon.
              </span>
            </div>
            <ArrowLink to="/case-study/mabia-ai" className="whitespace-nowrap font-semibold">
              View Project Evidence
            </ArrowLink>
          </div>
        </ScrollReveal>

        {/* Distinct Subsection: Beyond Engineering (Creative Practice) */}
        <div className="pt-10 border-t border-line/10 space-y-8">
          <ScrollReveal delay={100}>
            <div className="max-w-2xl">
              <p className="eyebrow !text-ink-muted">Beyond Engineering</p>
              <h3 className="mt-3 text-title-lg font-bold text-ink">
                Creative practice, music, and expression.
              </h3>
              <p className="mt-2 text-body text-ink-soft leading-relaxed">
                Live musicianship in church worship ensembles. Exploring rhythm, timing, and harmonic cohesion
                through continuous practice and ensemble collaboration.
              </p>
            </div>
          </ScrollReveal>

          {/* 2-Column Editorial Grid for Bass Guitar and Piano/Keyboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 items-start">
            {creativePractices.map((practice, index) => (
              <ScrollReveal key={practice.id} delay={150 + index * 80} className="h-full">
                <CreativePracticeItem practice={practice} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
