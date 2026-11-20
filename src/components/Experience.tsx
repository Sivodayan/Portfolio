import React from 'react';
import TextEngine from 'spring-text-engine';

export const Experience: React.FC = () => {
  return (
    <>
      {/* Education & Leadership Section */}
      <section className="section my-16 md:my-24" id="experience">
        <div className="mb-4">
          <TextEngine
            tag="h2"
            mode="once"
            letterOut={{ opacity: 0, scale: 0 }}
            letterIn={{ opacity: 1, scale: 1 }}
            letterConfig={{ tension: 426, friction: 17 }}
            letterStagger={27}
            className="section-heading !mb-0 !border-none !pb-0 text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm"
          >
            Education &amp; Leadership
          </TextEngine>
          <p className="text-xs text-[#cbd5e1] mt-1 font-mono">
            Academic milestones, leadership appointments &amp; extracurricular impact
          </p>
        </div>

        <div className="timeline-list">
          {/* University of Moratuwa */}
          <div className="timeline-entry">
            <div className="timeline-date">Nov 2025 — Present</div>
            <div>
              <TextEngine
                tag="h3"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className="timeline-role text-lg font-bold text-white mb-1"
              >
                B.Sc. (Hons) in Engineering
              </TextEngine>
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
              <TextEngine
                tag="h3"
                mode="once"
                letterOut={{ opacity: 0, scale: 0 }}
                letterIn={{ opacity: 1, scale: 1 }}
                letterConfig={{ tension: 426, friction: 17 }}
                letterStagger={27}
                className="timeline-role text-lg font-bold text-white mb-1"
              >
                Secondary Education
              </TextEngine>
              <div className="timeline-org">Jaffna Hindu College</div>
              <div className="timeline-details">
                <ul>
                  <li><strong>Board of Prefects</strong> member with institutional service.</li>
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
