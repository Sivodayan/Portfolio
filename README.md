# Sujeevakumar Sivodayan — Developer Portfolio

A modern developer portfolio engineered with **React 19, TypeScript, Vite 6, Tailwind CSS, Three.js, and React Bits Pro components**. Built for high visual impact, tactile micro-interactions, and seamless typography clarity.

Live Demo: [https://sivodayan.devs.surf](https://sivodayan.devs.surf)

---

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Custom CSS Design Tokens
- **3D Graphics & Shaders**: [Three.js](https://threejs.org/) + GLSL Vertex & Fragment Shaders
- **Physics & Motion**: [GSAP 3](https://greensock.com/gsap/) (`Draggable`, momentum throwing) + [Framer Motion](https://www.framer.com/motion/)
- **Icons**: Lucide React + Inline Optimized SVGs

---

## ✨ Features & React Bits Pro Components

1. **Full-Screen ASCII Stream (`<AsciiStream />`)**:
   - Atmospheric terminal stream background pulsating `"dev sivodayan @cse"` in cyan and neon pink over WebGL.
   - Ambient dark vignette scrim for contrast and legibility.

2. **Custom Interactive Spring Cursor (`<CustomCursor />`)**:
   - High-precision single-spring cursor with fluid target morphing over interactive buttons, links, and cards.

3. **Chroma Card Portrait (`<ChromaCard />`)**:
   - WebGL shader card featuring signed distance field (SDF) rounded corner discard, 3D mouse parallax tilt, and chromatic aberration / RGB shift on hover.
   - Layered over a vibrant tilted accent backing card.

4. **Hyperspace Warp Field (`<Lightspeed />`)**:
   - Three.js hyperspace star streak background seamlessly masked with radial gradient edges under the projects showcase.

5. **3D Circle Gallery (`<CircleGallery />` / `<d />`)**:
   - Radial 3D cylinder carousel displaying portfolio projects.
   - Touch/mouse drag rotation with momentum throw physics and gentle auto-rotation (`autoSpin: 4 deg/s`).
   - Interactive 3D zoom-to-focus on click with soft background card blurring.
   - Synchronized project details panel with technical tags, architecture specs, and live demo / GitHub links.
   - Optional view toggle between 3D Circle Gallery and Grid View.

6. **Spectral Grid (`<SpectralTiles />`)**:
   - 3D glowing interactive spectral tiles field showcasing 16 core competencies across hardware, firmware, distributed systems, and web technologies.

7. **Rising Lines (`<RisingLines />`)**:
   - Filaments of light rising upward from a glowing horizon at the base of the page behind the contact channels.

8. **Education & Leadership Timeline**:
   - Real academic metrics: **B.Sc. (Hons) in Engineering, CSE Department @ University of Moratuwa (CGPA 3.54)**.
   - Leadership: **Department Representative of CSE**, AIESEC CXP Member, Mora Lenz Media, and Wibhawi Prathibha lead coordinator.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/devsivo/Portfolio.git

# Navigate into project directory
cd Portfolio

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` (or `http://localhost:5174`) in your browser.

### Production Build

```bash
# Type check and build optimized bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
Portfolio/
├── public/
│   └── assets/
│       ├── documents/
│       │   └── Sivodayan_Sujeevakumar_CV.pdf
│       └── images/
│           ├── avatar.jpg
│           ├── profile.jpg
│           └── projects/
│               ├── floodguard.png
│               ├── kopay_college.jpg
│               ├── mora_travels.jpg
│               └── uom_redesign.jpg
├── src/
│   ├── components/
│   │   ├── AsciiStream.tsx        # React Bits Pro: Fullscreen ASCII stream
│   │   ├── ChromaCard.tsx         # React Bits Pro: Holographic WebGL profile card
│   │   ├── CircleGallery.tsx      # React Bits Pro: 3D circular project tiles carousel (<d />)
│   │   ├── CircuitFlash.tsx       # Cyberpunk circuit animation
│   │   ├── Contact.tsx            # Contact section & direct communication channels
│   │   ├── CustomCursor.tsx       # React Bits Pro: Interactive spring cursor
│   │   ├── Experience.tsx         # Education & leadership timeline
│   │   ├── Footer.tsx             # Page footer
│   │   ├── Header.tsx             # Navbar with live Sri Lanka time
│   │   ├── Hero.tsx               # Two-column hero with display typography
│   │   ├── Lightspeed.tsx         # React Bits Pro: Hyperspace warp field
│   │   ├── LoadingScreen.tsx      # Initial load screen
│   │   ├── Projects.tsx           # Selected projects showcase
│   │   ├── RisingLines.tsx        # React Bits Pro: Rising light filaments
│   │   ├── SkillsShowcase.tsx     # React Bits Pro: Spectral tiles skills grid
│   │   ├── SpectralTiles.tsx      # React Bits Pro: 3D interactive mesh
│   │   └── StaggeredText.tsx      # Word-by-word blur-in entrance animation
│   ├── App.tsx                    # Main app container
│   ├── index.css                  # Global design tokens, Tailwind directives & typography
│   └── main.tsx                   # React root mount
├── .gitignore                     # Git ignore rules
├── index.html                     # HTML root template
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript compiler configuration
└── vite.config.ts                 # Vite bundler configuration
```

---

## 👤 Author

**Sujeevakumar Sivodayan**
- **Department**: Computer Science & Engineering, University of Moratuwa
- **Email**: [sivodayan18@gmail.com](mailto:sivodayan18@gmail.com)
- **LinkedIn**: [sivodayan-sujeevakumar](https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/)
- **GitHub**: [@devsivo](https://github.com/devsivo)

---

## 📄 License

This project is open-source under the MIT License.
