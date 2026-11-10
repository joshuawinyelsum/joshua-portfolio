import type { ReactNode } from 'react';
import { Project, ProjectEvidence } from '../../types';
import { getProjectCover } from '../../data/projectMedia';
import { ScrollReveal } from '../ScrollReveal';
import { ArrowLink } from '../ui/ArrowLink';
import { Button } from '../ui/Button';
import { LayeredSurface } from '../ui/LayeredSurface';
import { StatusTag, Tag } from '../ui/Tag';
import { ProjectScreen } from './ProjectScreen';

interface ProjectEvidenceSectionProps {
  project: Project;
  evidence: ProjectEvidence;
}

function Block({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section>
      <ScrollReveal>
        <h2 className="eyebrow">
          {number} — {title}
        </h2>
      </ScrollReveal>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * Evidence-based presentation of a team project: organisation and
 * programme, the role exactly as documented, the product, the verified
 * stack, the team and the real interface, with links to the live
 * application and the source. What the individual did and what the team
 * built are kept visibly apart.
 */
export function ProjectEvidenceSection({ project, evidence }: ProjectEvidenceSectionProps) {
  const cover = getProjectCover(project.id);

  return (
    <article className="container-content">
      <header>
        <ArrowLink to="/" back className="!text-ink-muted">
          Back to home
        </ArrowLink>

        <ScrollReveal className="mt-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <p className="eyebrow">
              {evidence.organization} · {evidence.programme}
            </p>
            <StatusTag status={project.status} />
          </div>

          <h1 className="mt-5 max-w-4xl break-words text-display font-extrabold text-ink text-balance">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-lead font-medium text-ink-muted md:text-xl">{evidence.tagline}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            {project.liveUrl && (
              <Button href={project.liveUrl} external icon="diagonal">
                Open Live Application
              </Button>
            )}
            {project.repoUrl && (
              <ArrowLink href={project.repoUrl} external>
                View GitHub repository
              </ArrowLink>
            )}
          </div>
        </ScrollReveal>
      </header>

      {/* The actual interface */}
      {cover && (
        <ScrollReveal className="mt-14 max-w-4xl">
          <figure className="group">
            <ProjectScreen project={project} eager />
            <figcaption className="mt-4 text-small text-ink-muted">{cover.caption}</figcaption>
          </figure>
        </ScrollReveal>
      )}

      <div className="mt-16 grid items-start gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Verified stack */}
        <aside className="lg:sticky lg:top-28 lg:order-last">
          <ScrollReveal>
            <LayeredSurface stack="none" tone="sunken" faceClassName="p-6">
              <h2 className="text-small font-semibold text-ink">Verified stack</h2>
              <dl className="mt-4 space-y-4">
                {evidence.stack.map((group) => (
                  <div key={group.layer}>
                    <dt className="text-caption text-ink-muted">{group.layer}</dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <Tag key={item} tone="surface">
                          {item}
                        </Tag>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </LayeredSurface>
          </ScrollReveal>
        </aside>

        <div className="max-w-3xl space-y-16">
          <Block number="01" title="Overview">
            <ScrollReveal>
              <p className="text-title font-medium text-ink md:text-xl md:leading-relaxed">{evidence.overview[0]}</p>
              {evidence.overview.slice(1).map((paragraph) => (
                <p key={paragraph} className="mt-4 text-body text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </ScrollReveal>
          </Block>

          <Block number="02" title="My Documented Role">
            <ScrollReveal>
              <p className="text-title-lg font-bold text-ink">{evidence.role.title}</p>
              <p className="mt-2 text-lead text-ink-soft">{evidence.role.scope}</p>
              <p className="mt-4 text-small text-ink-muted">
                This is the role as recorded in the project README. It documents responsibilities at this level, so
                nothing more specific is claimed here.
              </p>
            </ScrollReveal>
          </Block>

          <Block number="03" title="What the Team Built">
            <ScrollReveal>
              <p className="mb-5 text-small text-ink-muted">
                Capabilities of the whole product, credited to the team of three and listed as working in the README.
              </p>
              <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2">
                {evidence.teamCapabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-3 text-body text-ink-soft">
                    <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-lavender" aria-hidden="true" />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </Block>

          <Block number="04" title="Team">
            <ul className="rows -mt-4">
              {evidence.team.map((member, index) => (
                <li key={member.name}>
                  <ScrollReveal
                    delay={index * 60}
                    className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
                  >
                    <p className="text-body font-bold text-ink">
                      {member.name}
                      {member.isSelf && (
                        <Tag tone="cream" className="ml-2 align-middle">
                          Me
                        </Tag>
                      )}
                    </p>
                    <p className="text-body text-ink-soft">{member.role}</p>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </Block>

          <ScrollReveal>
            <p className="text-small text-ink-muted">
              Source for the role, team, stack and capabilities:{' '}
              <a
                href={evidence.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent"
              >
                {evidence.source.label}
              </a>
              .
            </p>
          </ScrollReveal>

          <ArrowLink to="/" back>
            Back to all work
          </ArrowLink>
        </div>
      </div>
    </article>
  );
}
