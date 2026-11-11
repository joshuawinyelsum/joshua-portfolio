import { SectionHeader } from '../components/SectionHeader';
import { ScrollReveal } from '../components/ScrollReveal';
import { LeadershipEntry } from '../components/leadership/LeadershipEntry';
import { CampusAppointment } from '../components/leadership/CampusAppointment';
import { CreativePracticeItem } from '../components/leadership/CreativePracticeItem';
import {
  communityLeadership,
  campusLeadership,
  collaborativeEngineering,
  creativePractices,
} from '../data/leadership';

export function LeadershipCommunity() {
  return (
    <section id="leadership" className="section">
      <div className="container-content space-y-16">
        {/* Section Header */}
        <SectionHeader
          title="Leadership & Community"
          subtitle="Community building, campus representation, and collaborative innovation."
          accent="collaborative innovation."
        />

        {/* Primary Leadership & Collaboration Grid */}
        <div className="space-y-10">
          {/* Row 1: Kelnode (Community) & WIWIK 100 (Campus Leadership) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            <ScrollReveal delay={50} className="h-full">
              <LeadershipEntry entry={communityLeadership} />
            </ScrollReveal>

            <ScrollReveal delay={150} className="h-full">
              <CampusAppointment entry={campusLeadership} />
            </ScrollReveal>
          </div>

          {/* Row 2: UNICEF StartUp Lab — MABIA AI (Collaborative Innovation) */}
          <ScrollReveal delay={250}>
            <LeadershipEntry entry={collaborativeEngineering} />
          </ScrollReveal>
        </div>

        {/* Distinct Subsection: Beyond Engineering (Creative Practice) */}
        <div className="pt-8 border-t border-line/15 space-y-10">
          <ScrollReveal delay={100}>
            <div className="max-w-2xl">
              <p className="eyebrow !text-ink-muted">Beyond Engineering</p>
              <h3 className="mt-3 text-h2 font-extrabold text-ink tracking-tight">
                Creative practice, music and expression.
              </h3>
              <p className="mt-3 text-body text-ink-soft leading-relaxed">
                Active musicianship in church worship ensembles. Exploring rhythm, timing, and harmonic cohesion
                through disciplined live practice and collaboration with fellow musicians.
              </p>
            </div>
          </ScrollReveal>

          {/* 2-Column Grid for Bass Guitar and Piano/Keyboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            {creativePractices.map((practice, index) => (
              <ScrollReveal key={practice.id} delay={180 + index * 100} className="h-full">
                <CreativePracticeItem practice={practice} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
