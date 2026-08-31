import { Hero } from '../sections/Hero';
import { Story } from '../sections/Story';
import { About } from '../sections/About';
import { EngineeringStack } from '../sections/EngineeringStack';
import { SelectedWork } from '../sections/SelectedWork';
import { Research } from '../sections/Research';
import { Experience } from '../sections/Experience';
import { CurrentlyBuilding } from '../sections/CurrentlyBuilding';
import { Philosophy } from '../sections/Philosophy';
import { Education } from '../sections/Education';
import { CareerDirection } from '../sections/CareerDirection';
import { Contact } from '../sections/Contact';
import { Footer } from '../sections/Footer';

export function Home() {
  return (
    <>
      <main>
        <Hero />
        <Story />
        <SelectedWork />
        <About />
        <EngineeringStack />
        <Research />
        <Experience />
        <CurrentlyBuilding />
        <Philosophy />
        <Education />
        <CareerDirection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
