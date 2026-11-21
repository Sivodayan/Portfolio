import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import TextEngine from 'spring-text-engine';
import GlitchHeading from './GlitchHeading';

interface ProjectData {
  id: string;
  title: string;
  tag: string;
  desc: string;
  tags: string[];
  image: string;
  imageAlt?: string;
  links?: { label: string; href: string }[];
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
    links: [
      { label: 'View Source  ↗', href: 'https://github.com/Sivodayan/Flood-Alert-System' },
      { label: 'Live Demo ↗', href: 'https://github.com/Sivodayan/Flood-Alert-System' },
    ],
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
      { label: 'View Source  ↗', href: 'https://github.com/Sivodayan/KCC-Project' },
      { label: 'Live Demo ↗', href: 'https://jkcc.edu.lk' },
    ],
  },
  {
    id: 'uom-redesign',
    title: 'UoM Website Redesign',
    tag: 'UI Concept',
    image: 'assets/images/projects/uom_redesign.jpg',
    imageAlt: 'University of Moratuwa Portal Concept Redesign',
    desc: 'Responsive concept redesign for the official University of Moratuwa website, featuring a frosted-glass navigation system, fluid faculty explorer, and seamless responsive scaling.',
    tags: ['HTML5', 'Modern CSS', 'JavaScript', 'UI/UX'],
    links: [
      { label: 'View Source  ↗', href: 'https://github.com/Sivodayan/UoM-Redesign' },
      { label: 'Live Demo ↗', href: 'https://sivodayan.github.io/UoM-Redesign/' },
    ],
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
      { label: 'View Source  ↗', href: 'https://github.com/Sivodayan/MORA-Travels' },
      { label: 'Live Demo ↗', href: 'https://sivodayan.github.io/MORA-Travels/' },
    ],
  },
];

interface ProjectCardProps {
  project: ProjectData;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
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
      className="project-item !p-4 !rounded-2xl bg-black/40 hover:bg-black/65 border border-white/10 hover:border-[#44f0ff]/50 backdrop-blur-md transition-all flex flex-col justify-between h-full min-h-0 sm:min-h-[440px] lg:min-h-[460px]"
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
          <div className="project-links !mt-1 !text-xs flex flex-wrap items-center gap-2 border-t border-white/10 pt-2">
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
        )}
      </div>
    </article>
  );
};

export const Projects: React.FC = () => {
  return (
    <section className="section relative w-full min-h-[100dvh] flex flex-col justify-center py-12 sm:py-16" id="projects">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full my-auto"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
          <div>
            <GlitchHeading>
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
            </GlitchHeading>
            <p className="text-xs font-mono text-[#cbd5e1] mt-0.5">
              Featured Engineering, Embedded &amp; Web Systems
            </p>
          </div>
        </div>

        {/* Clean Grid Layout Spanning the Section with staggered card entry */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-stretch"
        >
          {PROJECTS_DATA.map((proj) => (
            <motion.div
              key={proj.id}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.98 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="h-full"
            >
              <ProjectCard project={proj} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Projects;
