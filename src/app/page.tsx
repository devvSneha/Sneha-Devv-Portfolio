import { contact, site } from "@/data/portfolio";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ProjectModal } from "@/components/ProjectModal";
import { UIProvider } from "@/components/UIProvider";
import { Contact } from "@/sections/Contact";
import { Experience } from "@/sections/Experience";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";
import { Skills } from "@/sections/Skills";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.fullName,
    jobTitle: site.role,
    url: site.url,
    email: `mailto:${contact.email}`,
    description: site.description,
    sameAs: contact.links.map((l) => l.href),
  };

  return (
    <UIProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
      <ProjectModal />
      <CommandPalette />
    </UIProvider>
  );
}
