import { SectionHeader } from '../components/SectionHeader';
import { MetadataItem } from '../components/MetadataItem';
import { ScrollReveal } from '../components/ScrollReveal';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 section-padding bg-white">
      <div className="max-w-4xl">
        <SectionHeader title="About Me" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <ScrollReveal>
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-semibold">
                I'm Joshua Winyelsum, a Computer Science student, software engineer in the making,
                and AI & data systems researcher.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <p className="text-[15px] text-gray-600 leading-[1.8]">
                My journey into technology started during the COVID-19 lockdowns, when I began
                teaching myself programming. What started as curiosity became a deeper interest in
                understanding how software works, how systems scale, and how technology can be
                applied to problems beyond the screen.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={140}>
              <p className="text-[15px] text-gray-600 leading-[1.8]">
                Today, I'm strengthening my foundations in Python, backend engineering, problem
                solving, and systems while exploring machine learning, computer vision, and
                data-intensive applications.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-[15px] text-gray-600 leading-[1.8]">
                I'm particularly interested in problems where data is fragmented, incomplete, or
                difficult to use—especially within agriculture and other real-world environments
                where better data systems and intelligent technology can make a difference.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={260}>
              <p className="text-[15px] text-gray-600 leading-[1.8]">
                I'm also developing as a researcher, investigating datasets, data pipelines,
                schemas, and the gaps that make real-world information difficult to use effectively.
              </p>
            </ScrollReveal>
          </div>

          {/* Metadata sidebar */}
          <div>
            <MetadataItem label="From" value="Bawku, Upper East Region, Ghana" delay={100} />
            <MetadataItem label="Currently" value="Tamale, Ghana" delay={160} />
            <MetadataItem label="Education" value="BSc Computer Science — UDS" delay={220} />
            <MetadataItem label="Languages" value="English · Kusaal" delay={280} />
          </div>
        </div>
      </div>
    </section>
  );
}
