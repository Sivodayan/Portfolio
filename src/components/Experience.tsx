import React from 'react';
import StaggeredText from './StaggeredText';

export const Experience: React.FC = () => {
  return (
    <>
      {/* Education & Leadership Section */}
      <section className="section my-16 md:my-24" id="experience">
        <div className="mb-4">
          <StaggeredText
            as="h2"
            text="Education & Leadership"
            segmentBy="words"
            className="section-heading !mb-0 !border-none !pb-0 text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm"
            duration={0.5}
            delay={70}
          />
          <p className="text-xs text-[#cbd5e1] mt-1 font-mono">
            Academic milestones, leadership appointments & extracurricular impact
          </p>
        </div>

        <div className="timeline-list">
          {/* University of Moratuwa */}
          <div className="timeline-entry">
            <div className="timeline-date">Nov 2025 — Present</div>
            <div>
              <div className="timeline-role">B.Sc. (Hons) in Engineering</div>
              <div className="timeline-org">University of Moratuwa • Computer Science and Engineering Department</div>
              <div className="timeline-details">
                <ul>
                  <li><strong>Department Representative</strong> of the Computer Science and Engineering Department.</li>
                  <li>Maintaining a <strong>CGPA of 3.54</strong> across engineering, algorithms, and systems coursework.</li>
                  <li>Member of the <strong>CXP (Customer Experience) Team in AIESEC</strong>.</li>
                  <li>Member of <strong>Mora Lenz Club</strong> (official university media and photography organization).</li>
                  <li>Coordinated and announced <strong>Wibhawi Prathibha</strong>, the university's flagship freshers' induction event.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Jaffna Hindu College */}
          <div className="timeline-entry">
            <div className="timeline-date">Jan 2016 — Apr 2025</div>
            <div>
              <div className="timeline-role">Secondary Education</div>
              <div className="timeline-org">Jaffna Hindu College</div>
              <div className="timeline-details">
                <ul>
                  <li>Member of the <strong>Board of Prefects</strong>.</li>
                  <li>President of the <strong>Cycling Club</strong> and leader in the <strong>Eastern Band</strong>.</li>
                  <li>Secretary of the <strong>Red Cross Society</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Experience;
