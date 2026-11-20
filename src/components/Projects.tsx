import React, { useState, useRef } from 'react';
import StaggeredText from './StaggeredText';
import Lightspeed from './Lightspeed';
import { d as CircleGalleryComponent } from './CircleGallery';

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
    title: 'IoT Flood Early Warning & Alert System (FloodGuard)',
    tag: 'Special Term Project',
    image: 'assets/images/projects/floodguard.png',
    imageAlt: 'FloodGuard Node & FastAPI ML Live Telemetry Interface',
    desc: 'A multi-node early warning telemetry dashboard engineered by Team Void Warriors to monitor water levels in flood-prone waterways. Connects ultrasonic sensors to ESP32 and Arduino microcontrollers, streaming live hydrometric trends, threshold alerts, and automated SMS broadcasts over GSM.',
    tags: ['ESP32', 'FastAPI ML', 'Arduino', 'GSM SIM800L', 'MQTT', 'C++'],
    drawerDetails: 'Engineered for high-resilience riverbanks. Microcontrollers take periodic ultrasonic distance pings, trigger dual GSM modem broadcast pulses, and failover gracefully between cellular band and local telemetry.',
    flowSteps: ['Ultrasonic Ping', 'ESP32 Sampling', 'GSM SIM800L Alert', 'MQTT Broker', 'Dashboard'],
  },
  {
    id: 'kopay-college',
    title: 'J/Kopay Christian College — Official Web Portal',
    tag: 'Web Application',
    image: 'assets/images/projects/kopay_college.jpg',
    imageAlt: 'J/Kopay Christian College Official Website Concept',
    desc: 'A performant modern web portal built with React 19 and Tailwind CSS for J/Kopay Christian College (est. 1852 in Jaffna), featuring school history, academic performance boards, faculty gallery, and event calendar with rapid sub-second transitions.',
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
    title: 'University of Moratuwa — Portal Redesign',
    tag: 'UI Concept',
    image: 'assets/images/projects/uom_redesign.jpg',
    imageAlt: 'University of Moratuwa Portal Concept Redesign',
    desc: 'A responsive concept redesign for the official University of Moratuwa website, addressing navigation clutter with a clean frosted-glass header, fluid faculty explorer, and seamless layout scaling from mobile screens to ultra-wide displays.',
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
    title: 'MORA Travels — Expedition & Tour Portal',
    tag: 'Excursion Logs',
    image: 'assets/images/projects/mora_travels.jpg',
    imageAlt: 'MORA Travels Tour & Route Planning Platform',
    desc: 'An interactive travel and expedition log interface designed for university student club trips, featuring visual itinerary cards, route checkpoints, and packing lists.',
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

    const rotX = ((y - centerY) / centerY) * -4;
    const rotY = ((x - centerX) / centerX) * 4;

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
      className="project-item"
      style={{
        transform: transformStyle,
        transition: 'transform 0.15s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Specular sheen effect */}
      <div
        className="project-shine"
        style={{
          background: `radial-gradient(320px circle at ${shinePos.x}px ${shinePos.y}px, rgba(255, 255, 255, 0.08), transparent 60%)`,
          opacity: shinePos.opacity,
        }}
        aria-hidden="true"
      />

      {/* Project Screenshot Cover */}
      {project.image && (
        <div className="project-image-wrap">
          <img
            src={project.image}
            alt={project.imageAlt || project.title}
            loading="lazy"
          />
          <div className="project-image-overlay" />
        </div>
      )}

      <div className="project-header">
        <h3 className="project-name">
          <span>{project.title}</span>
        </h3>
        <span className="project-tag">{project.tag}</span>
      </div>

      <p className="project-desc">{project.desc}</p>

      <div className="project-tech">
        {project.tags.map((t, idx) => (
          <span key={idx} className="tech-badge">
            {t}
          </span>
        ))}
      </div>

      {project.links && project.links.length > 0 && (
        <div className="project-links">
          {project.links.map((link, idx) => (
            <React.Fragment key={idx}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                <span>{link.label}</span>
              </a>
              {idx < project.links!.length - 1 && <span style={{ color: 'var(--text-muted)' }}>•</span>}
            </React.Fragment>
          ))}
          {project.drawerDetails && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <button
                className="drawer-toggle-btn"
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <span>{drawerOpen ? 'Hide specs ↑' : 'Quick architecture view ↓'}</span>
              </button>
            </>
          )}
        </div>
      )}

      {project.drawerDetails && !project.links && (
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="drawer-toggle-btn"
            aria-expanded={drawerOpen}
          >
            <span>{drawerOpen ? 'Hide specs ↑' : 'Architecture & Telemetry Specs ↓'}</span>
          </button>
        </div>
      )}

      {project.drawerDetails && (
        <div className={`project-drawer ${drawerOpen ? 'open' : ''}`}>
          <div className="drawer-content">
            <p>{project.drawerDetails}</p>
            {project.flowSteps && project.flowSteps.length > 0 && (
              <div className="architecture-flow">
                {project.flowSteps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className="flow-step">{step}</span>
                    {idx < project.flowSteps!.length - 1 && <span className="flow-arrow">➔</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(PROJECTS_DATA[0]);
  const [viewMode, setViewMode] = useState<'circle' | 'grid'>('circle');

  // React Bits component
  const D = CircleGalleryComponent;

  return (
    <section className="section relative my-16 md:my-24" id="projects">
      {/* React Bits Pro: Lightspeed Hyperspace Warp Background - Seamless Edge Blend */}
      <div
        className="absolute -inset-x-8 sm:-inset-x-16 -inset-y-12 pointer-events-none z-0 opacity-45 overflow-hidden"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 35%, transparent 100%)',
        }}
      >
        <Lightspeed
          primaryColor="#44f0ff"
          secondaryColor="#ff087b"
          tertiaryColor="#38bdf8"
          speed={0.65}
          intensity={1.15}
          streakCount={120}
          stretchFactor={0.06}
          fadePower={2.0}
          opacity={0.75}
          className="w-full h-full pointer-events-auto"
        />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <StaggeredText
              as="h2"
              text="Selected Projects"
              segmentBy="words"
              className="section-heading !mb-0 !border-none !pb-0 text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm"
              duration={0.4}
              delay={45}
            />
            <p className="text-sm sm:text-base text-[#cbd5e1] mt-1.5 font-mono">
              3D interactive carousel • Drag to rotate ring, click tile to inspect
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View switcher */}
            <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setViewMode('circle')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-mono transition-all ${
                  viewMode === 'circle'
                    ? 'bg-[#44f0ff]/20 text-[#44f0ff] border border-[#44f0ff]/30 shadow-[0_0_12px_rgba(68,240,255,0.25)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                3D Circle Gallery
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-mono transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#44f0ff]/20 text-[#44f0ff] border border-[#44f0ff]/30 shadow-[0_0_12px_rgba(68,240,255,0.25)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Grid View
              </button>
            </div>
          </div>
        </div>

        {/* 3D Circle Gallery Layout (React Bits Pro: <d />) */}
        {viewMode === 'circle' ? (
          <div className="relative flex flex-col items-center">
            {/* Unboxed, Open 3D Space */}
            <div className="w-full my-1 relative">
              {/* React Bits Pro: Circle Gallery component */}
              <D
                radiusPercent={32}
                itemWidth={280}
                itemHeight={380}
                itemScale={0.85}
                borderRadius={16}
                enableDrag={true}
                throwResistance={0.35}
                animationDuration={0.9}
                showNumbers={true}
                autoSpin={4}
                onItemClick={(idx: number) => {
                  const selected = PROJECTS_DATA[idx % PROJECTS_DATA.length];
                  setActiveProject(selected);
                }}
              />
            </div>

            {/* Seamless Active Project Details beneath the 3D gallery */}
            {activeProject && (
              <div className="w-full mt-5 pt-7 border-t border-white/10 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#44f0ff]/15 text-[#44f0ff] border border-[#44f0ff]/30 font-semibold">
                        {activeProject.tag}
                      </span>
                      <span className="text-xs font-mono text-white/70">Focused Project</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2.5 drop-shadow-sm">
                      {activeProject.title}
                    </h3>
                    <p className="text-base md:text-lg text-[#f1f5f9] leading-relaxed mb-5 font-normal">
                      {activeProject.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {activeProject.tags.map((t, idx) => (
                        <span key={idx} className="tech-badge">
                          {t}
                        </span>
                      ))}
                    </div>

                    {activeProject.drawerDetails && (
                      <p className="text-sm md:text-base text-[#e2e8f0] italic border-l-2 border-[#44f0ff]/60 pl-3.5 py-1.5 mb-5 bg-white/[0.04] rounded-r">
                        {activeProject.drawerDetails}
                      </p>
                    )}

                    {activeProject.flowSteps && (
                      <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-mono text-[#cbd5e1] mb-2">
                        <span className="text-xs text-[#44f0ff] uppercase tracking-wider font-bold">Flow:</span>
                        {activeProject.flowSteps.map((step, idx) => (
                          <React.Fragment key={idx}>
                            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white font-medium">
                              {step}
                            </span>
                            {idx < activeProject.flowSteps!.length - 1 && (
                              <span className="text-[#44f0ff]">➔</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>

                  {activeProject.links && activeProject.links.length > 0 && (
                    <div className="flex md:flex-col gap-2.5 shrink-0">
                      {activeProject.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-xl text-sm font-mono font-bold bg-[#44f0ff]/15 hover:bg-[#44f0ff]/25 text-[#44f0ff] border border-[#44f0ff]/40 hover:border-[#44f0ff] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(68,240,255,0.15)]"
                        >
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Grid Fallback View */
          <div className="projects-list mt-6">
            {PROJECTS_DATA.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
