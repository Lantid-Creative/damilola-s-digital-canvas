import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Awards from "@/components/Awards";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingParticles from "@/components/FloatingParticles";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <FloatingParticles count={15} />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Experience />
      <Projects />
      <TechStack />
      <Awards />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
