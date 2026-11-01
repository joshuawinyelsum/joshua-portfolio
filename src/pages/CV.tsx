import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { experience } from '../data/experience';
import { education, credentials } from '../data/education';
import { projects } from '../data/projects';
import { researchAreas } from '../data/research';
import { skills, skillCategories } from '../data/skills';
import { Footer } from '../sections/Footer';
import { ScrollReveal } from '../components/ScrollReveal';

export function CV() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Interactive CV | Joshua Winyelsum';
  }, []);

  return (
    <>
      <main className="pt-24 md:pt-32 pb-24 max-w-[800px] mx-auto px-6 md:px-12 selection:bg-gray-900 selection:text-white">
        <article className="space-y-24">
          
          {/* Header */}
          <section className="mb-24">
            <ScrollReveal>
              <div className="mb-12">
                <button 
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
                  }}
                  className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <span className="text-gray-300">←</span> Home
                </button>
              </div>
              <h1 className="text-3xl md:text-[2.5rem] font-extrabold text-gray-900 tracking-tight leading-none mb-4">
                JOSHUA WINYELSUM
              </h1>
              <h2 className="text-sm md:text-base font-semibold tracking-wide text-gray-600 mb-8">
                Software & Systems Engineer <span className="text-gray-300 mx-1">/</span> Computer Science Student
              </h2>
              <div className="text-sm md:text-[15px] text-gray-800 leading-[1.8] max-w-2xl font-medium">
                <p>Architecting reliable backend systems, relational databases, offline-first applications, and data pipelines.</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-[12px] font-mono tracking-wide text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Tamale / Bawku, Ghana
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    BSc Computer Science @ UDS
                  </span>
                  <a href="mailto:joshuawinyelsum@gmail.com" className="flex items-center gap-1.5 text-gray-900 hover:text-blue-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* 01 / EXPERIENCE */}
          <section>
            <ScrollReveal>
              <div className="flex items-baseline gap-4 mb-10 border-b border-gray-200/60 pb-3">
                <span className="text-[11px] font-mono tracking-widest text-gray-400">01 /</span>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900">Experience</h3>
              </div>
              <div className="space-y-16">
                {experience.map((item, i) => (
                  <div key={i} className="group relative">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-3">
                      <h4 className="text-base font-bold text-gray-900">{item.company}</h4>
                    </div>
                    <p className="text-sm font-semibold text-blue-600 mb-4">{item.role}</p>
                    <div className="text-[14.5px] text-gray-600 leading-relaxed max-w-[650px] mb-5 font-medium">
                      {item.description}
                    </div>
                    {item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-4">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mr-2 py-0.5">Stack:</span>
                        {item.technologies.map((tech, index) => (
                          <span key={tech} className="text-[11px] font-mono text-gray-600">
                            {tech}{index < item.technologies.length - 1 ? <span className="text-gray-300 mx-1">·</span> : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* 02 / ENGINEERING */}
          <section>
            <ScrollReveal>
              <div className="flex items-baseline gap-4 mb-10 border-b border-gray-200/60 pb-3">
                <span className="text-[11px] font-mono tracking-widest text-gray-400">02 /</span>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900">Engineering Stack</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {skillCategories.map(category => {
                  const categorySkills = skills.filter(s => s.category === category);
                  if (categorySkills.length === 0) return null;
                  return (
                    <div key={category}>
                      <h4 className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">{category}</h4>
                      <div className="text-[14px] font-medium text-gray-800 leading-relaxed">
                        {categorySkills.map((skill, index) => (
                          <span key={skill.name}>
                            {skill.name}
                            {index < categorySkills.length - 1 && <span className="text-gray-300 mx-2 font-light">·</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </section>

          {/* 03 / SELECTED WORK */}
          <section>
            <ScrollReveal>
              <div className="flex items-baseline gap-4 mb-10 border-b border-gray-200/60 pb-3">
                <span className="text-[11px] font-mono tracking-widest text-gray-400">03 /</span>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900">Selected Work</h3>
              </div>
              <div className="space-y-16">
                {projects.filter(p => p.featured).map(project => (
                  <div key={project.id} className="relative group">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-blue-600">
                        {project.category}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-gray-200 text-gray-600 bg-gray-50">
                        {project.status}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h4>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">{project.subtitle}</p>
                    <p className="text-[15px] text-gray-600 leading-relaxed max-w-[650px] mb-5 font-medium">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <Link
                        to={project.ctaLink}
                        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {project.cta}
                        <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform">→</span>
                      </Link>
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-emerald-600 hover:underline"
                        >
                          Visit Live ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* 04 / RESEARCH */}
          <section>
            <ScrollReveal>
              <div className="flex items-baseline gap-4 mb-10 border-b border-gray-200/60 pb-3">
                <span className="text-[11px] font-mono tracking-widest text-gray-400">04 /</span>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900">Research Areas</h3>
              </div>
              <div className="space-y-12">
                {researchAreas.map((area, i) => (
                  <div key={i} className="group">
                    <h4 className="text-base font-bold text-gray-900 mb-3">{area.title}</h4>
                    <p className="text-[14.5px] text-gray-600 leading-relaxed max-w-[650px] font-medium mb-3">
                      {area.description}
                    </p>
                    <div className="text-[11px] font-bold tracking-widest uppercase text-gray-400">
                      Ongoing Investigation
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* 05 / EDUCATION */}
          <section>
            <ScrollReveal>
              <div className="flex items-baseline gap-4 mb-10 border-b border-gray-200/60 pb-3">
                <span className="text-[11px] font-mono tracking-widest text-gray-400">05 /</span>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900">Education & Credentials</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10">
                  {education.map((item, i) => (
                    <div key={i}>
                      <h4 className="text-[15px] font-bold text-gray-900 mb-1">{item.degree}</h4>
                      <p className="text-sm font-medium text-gray-800 mb-2">{item.institution}</p>
                      <p className="text-[12px] font-mono text-gray-500 mb-4">{item.location} · {item.status}</p>
                      {item.coursework && (
                        <div>
                          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-2">Relevant Coursework</p>
                          <div className="text-[13px] text-gray-600 font-medium leading-relaxed">
                            {item.coursework.join(' · ')}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="space-y-8">
                  {credentials.map((cred, i) => (
                    <div key={i}>
                      <h4 className="text-[14px] font-bold text-gray-900 mb-1">{cred.title}</h4>
                      <p className="text-[13px] text-gray-600 font-medium">{cred.issuer} <span className="text-gray-300 mx-1">—</span> {cred.type}</p>
                      {cred.score && <p className="text-[12px] font-mono text-blue-600 mt-2">Score: {cred.score}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </section>

        </article>
      </main>
      <Footer />
    </>
  );
}
