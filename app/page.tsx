import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Playground from "@/components/Playground";
import MachineRoom from "@/components/MachineRoom";
import NowPlaying from "@/components/NowPlaying";
import PersonalStats from "@/components/PersonalStats";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Playground />
      <MachineRoom />
      <NowPlaying />
      <PersonalStats />
      <Contact />
    </main>
  );
}
