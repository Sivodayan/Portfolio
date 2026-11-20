import React, { useState, useRef } from 'react';
import TextEngine from 'spring-text-engine';

interface ProjectData {
  id: string;
  title: string;
  tag: string;
  desc: string;
  tags: string[];
  image: string;
  imageAlt?: string;
  links?: { label: string; href: string }[];
  flowSteps?: string[];
  drawerDetails?: string;
}

const PROJECTS_DATA: ProjectData[] = [
  {
    id: 'floodguard',
    title: 'IoT Flood Early Warning (FloodGuard)',
    tag: 'Special Term Project',
    image: 'assets/images/projects/floodguard.png',
    imageAlt: 'FloodGuard Node & FastAPI ML Live Telemetry Interface',
    desc: 'Multi-node early warning telemetry dashboard engineered by Team Void Warriors to monitor waterways. Ultrasonic sensors on ESP32 & Arduino stream live hydrometric trends and SMS alerts over GSM.',
    tags: ['ESP32', 'FastAPI ML', 'Arduino', 'GSM SIM800L', 'MQTT', 'C++'],
    drawerDetails: 'Engineered for high-resilience riverbanks. Microcontrollers take periodic ultrasonic distance pings, trigger dual GSM modem broadcast pulses, and failover gracefully between cellular band and local telemetry.',
    flowSteps: ['Ultrasonic Ping', 'ESP32 Sampling', 'GSM SIM800L Alert', 'MQTT Broker', 'Dashboard'],
  },
  {
    id: 'kopay-college',
    title: 'J/Kopay Christian College Web Portal',
    tag: 'Web Application',
    image: 'assets/images/projects/kopay_college.jpg',
    imageAlt: 'J/Kopay Christian College Official Website Concept',
    desc: 'Performant modern web portal built with React 19 and Tailwind CSS for J/Kopay Christian College (est. 1852 in Jaffna), featuring academic performance boards, faculty gallery, and event calendar.',
    tags: ['React 19', 'Tailwind CSS', 'Vite', 'TypeScript'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/Sivodayan/JHC_WEBSITE' },
      { label: 'Live Demo ↗', href: 'https://sivodayan.github.io/JHC_WEBSITE/' },
    ],
    drawerDetails: 'Engineered for accessibility across low-bandwidth mobile connections in Northern Sri Lanka. Eliminated layout shifts and optimized bundle sizes.',
    flowSteps: ['React 19 Components', 'Vite 6 Optimization', 'Tailwind Styling', 'Admissions & Curricula Hub'],
  },
  {
    id: 'uom-redesign',
    title: 'University of Moratuwa Redesign',
    tag: 'UI Concept',
    image: 'assets/images/projects/uom_redesign.jpg',
    imageAlt: 'University of Moratuwa Portal Concept Redesign',
    desc: 'Responsive concept redesign for the official University of Moratuwa website, featuring a frosted-glass navigation system, fluid faculty explorer, and seamless responsive scaling.',
    tags: ['HTML5', 'Modern CSS', 'JavaScript', 'UI/UX'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/Sivodayan/UoM-Redesign' },
      { label: 'Live Demo ↗', href: 'https://sivodayan.github.io/UoM-Redesign/' },
    ],
    drawerDetails: 'Eliminated layout shifts (CLS < 0.01) and reduced visual cognitive overload for prospective engineering students.',
    flowSteps: ['Frosted Glass Header', 'Faculty Explorer', 'CSS Grid Layout', 'GitHub Pages Deployment'],
  },
  {
    id: 'mora-travels',
    title: 'MORA Travels Expedition Portal',
    tag: 'Excursion Logs',
    image: 'assets/images/projects/mora_travels.jpg',
    imageAlt: 'MORA Travels Tour & Route Planning Platform',
    desc: 'Interactive travel and expedition log interface designed for university student club trips, featuring visual itinerary cards, route checkpoints, and packing lists.',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    links: [
      { label: 'View on GitHub ↗', href: 'https://github.com/Sivodayan/MORA-Travels' },
    ],
    drawerDetails: 'Client-rendered expedition planner for student batches exploring hill country and nature reserves.',
    flowSteps: ['Route Selection', 'Waypoint Geolocation', 'Packing Checklist', 'Export Itinerary'],
  },
];

interface ProjectCardProps {
  project: ProjectData;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [transformStyle, setTransformStyle] = useState('perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)');
  const [shinePos, setShinePos] = useState({ x: -999, y: -999, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -3;
    const rotY = ((x - centerX) / centerX) * 3;

    setTransformStyle(`perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`);
    setShinePos({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)');
    setShinePos({ x: -999, y: -999, opacity: 0 });
  };

  return (
    <article
      ref={cardRef}
      className="project-item !p-3 sm:!p-3.5 !rounded-xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#44f0ff]/50 backdrop-blur-md transition-all flex flex-col justify-between"
      style={{
        transform: transformStyle,
        transition: 'transform 0.15s ease-out, border-color 0.2s, background-color 0.2s',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Specular sheen effect */}
      <div
        className="project-shine"
        style={{
          background: `radial-gradient(280px circle at ${shinePos.x}px ${shinePos.y}px, rgba(255, 255, 255, 0.08), transparent 60%)`,
          opacity: shinePos.opacity,
        }}
        aria-hidden="true"
      />

      <div>
        {/* Project Screenshot Cover */}
        {project.image && (
          <div className="project-image-wrap !mb-2 !rounded-lg overflow-hidden border border-white/10 aspect-[16/9]">
            <img
              src={project.image}
              alt={project.imageAlt || project.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="project-image-overlay" />
          </div>
        )}

        <div className="project-header !mb-1.5 flex items-start justify-between gap-2">
          <TextEngine
            tag="h3"
            mode="once"
            letterOut={{ opacity: 0, scale: 0 }}
            letterIn={{ opacity: 1, scale: 1 }}
            letterConfig={{ tension: 426, friction: 17 }}
            letterStagger={27}
            className="text-sm sm:text-[15px] font-bold text-white tracking-tight drop-shadow-sm leading-snug"
          >
            {project.title}
          </TextEngine>
          

          
        </div>

        <p className="project-desc !text-xs !leading-relaxed text-[#cbd5e1] !mb-2 line-clamp-3">
          {project.desc}
        </p>
      </div>

      <div>
        <div className="project-tech !gap-1 !mb-2">
          {project.tags.slice(0, 4).map((t, idx) => (
            <span key={idx} className="tech-badge !text-[10px] !px-1.5 !py-0.5 !rounded">
              {t}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-[10px] font-mono text-[#cbd5e1] self-center">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {project.links && project.links.length > 0 && (
          <div className="project-links !mt-1 !text-xs flex items-center justify-between border-t border-white/10 pt-2">
            <div className="flex items-center gap-2">
              {project.links.map((link, idx) => (
                <React.Fragment key={idx}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#44f0ff] font-semibold text-white transition-colors"
                  >
                    <span>{link.label}</span>
                  </a>
                  {idx < project.links!.length - 1 && (
                    <span className="text-white/30">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {project.drawerDetails && (
              <button
                className="drawer-toggle-btn text-[11px]"
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <span>{drawerOpen ? 'Hide specs ↑' : 'Specs ↓'}</span>
              </button>
            )}
          </div>
        )}

        {project.drawerDetails && !project.links && (
          <div className="border-t border-white/10 pt-1.5 mt-1">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="drawer-toggle-btn text-[11px]"
              aria-expanded={drawerOpen}
            >
              <span>{drawerOpen ? 'Hide specs ↑' : 'Specs ↓'}</span>
            </button>
          </div>
        )}

        {project.drawerDetails && (
          <div className={`project-drawer ${drawerOpen ? 'open' : ''}`}>
            <div className="drawer-content !text-xs !pt-2">
              <p>{project.drawerDetails}</p>
              {project.flowSteps && project.flowSteps.length > 0 && (
                <div className="architecture-flow !gap-1 !mt-1.5">
                  {project.flowSteps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="flow-step !text-[10px] !px-1.5 !py-0.5">{step}</span>
                      {idx < project.flowSteps!.length - 1 && <span className="flow-arrow text-[10px]">➔</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export const Projects: React.FC = () => {
  return (
    <section className="section relative w-full min-h-[100dvh] flex flex-col justify-center" id="projects">
      <div className="relative z-10 w-full my-auto py-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-3">
          <div>
            <TextEngine
              tag="h2"
              mode="once"
              letterOut={{ opacity: 0, scale: 0 }}
              letterIn={{ opacity: 1, scale: 1 }}
              letterConfig={{ tension: 426, friction: 17 }}
              letterStagger={27}
              className="section-heading !mb-0 !border-none !pb-0 text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm"
            >
              Selected Projects
            </TextEngine>
            <p className="text-xs font-mono text-[#cbd5e1] mt-0.5">
              Featured Engineering, Embedded & Web Systems
            </p>
          </div>
        </div>

        {/* Clean Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {PROJECTS_DATA.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
