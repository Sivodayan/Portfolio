# Sujeevakumar Sivodayan — Developer Portfolio

A high-performance modern developer portfolio engineered with **React 19, TypeScript, Vite 6, Tailwind CSS, Three.js, and Spring TextEngine**. Built with precision for visual elegance, tactile micro-interactions, dark/light theme switching, and seamless typography.

🌐 **Live Website**: [https://sivodayan.devs.surf](https://sivodayan.devs.surf)

---

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with full Dark/Light adaptive color tokens
- **3D Graphics & Shaders**: [Three.js](https://threejs.org/) + Custom GLSL Vertex & Fragment Shaders
- **Physics & Motion**:
  - [Framer Motion](https://www.framer.com/motion/) (Layout transitions, gestures, modals)
  - [GSAP 3](https://greensock.com/gsap/) (Smooth timeline tweens)
  - [Spring TextEngine](https://github.com) (Staggered spring-physics character animations)
- **UI & Notifications**: [Dynaura](https://github.com) Dynamic Island toasts
- **Icons**: [Lucide React](https://lucide.dev/) + Custom optimized inline SVGs
- **Deployment & Serverless**: [Vercel](https://vercel.com/) (Frontend CDN + Serverless API Functions)

---

## 🎨 Typography Architecture

The portfolio implements a deliberate four-tier font pairing:
- **Hero Display Heading (H1)**: [Anton](https://fonts.google.com/specimen/Anton) — Ultra-bold, authoritative typographic entrance.
- **Section Headings (H2)**: [Carter One](https://fonts.google.com/specimen/Carter+One) — Expressive display font with rounded geometry and energetic presence.
- **Body & Paragraphs**: [Inter](https://fonts.google.com/specimen/Inter) — Clean, legible modern sans-serif optimized for reading clarity across all screen sizes.
- **Badges, Telemetry & Code**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — High-legibility monospaced font for academic stats, tech tags, and time display.

---

## ✨ Core Features & Visual Systems

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

5. **3D Circle Gallery (`<CircleGallery />`)**:
   - Radial 3D cylinder carousel displaying portfolio projects.
   - Touch/mouse drag rotation with momentum throw physics and gentle auto-rotation (`autoSpin: 4 deg/s`).
   - Interactive 3D zoom-to-focus on click with soft background card blurring.
   - Synchronized project details panel with technical tags, architecture specs, and live demo / GitHub links.
   - View toggle between 3D Circle Gallery and Grid View.

6. **Spectral Grid (`<SpectralTiles />`)**:
   - 3D glowing interactive spectral tiles field showcasing core competencies across hardware, firmware, distributed systems, and web technologies.

7. **Rising Lines (`<RisingLines />`)**:
   - Filaments of light rising upward from a glowing horizon at the base of the page behind the contact channels.

8. **Education & Experience Showcase (`<Experience />`)**:
   - Smooth horizontal swipe/scroll container for academic metrics and leadership roles.
   - Academic: **B.Sc. (Hons) in Engineering, CSE Department @ University of Moratuwa (CGPA 3.54)**.
   - Leadership: **Department Representative of CSE**, AIESEC CXP Member, Mora Lenz Media, and Wibhawi Prathibha lead coordinator.
   - Adaptive light/dark elevation with custom amber hover illumination.

9. **Material 3 Contact Suite & Smart SMTP (`<Contact />`)**:
   - Dual-card M3 elevated layout: Contact details card on the left with one-click copy chips and CV download; elevated message form on the right.
   - Seamless scroll-to-bottom behavior that keeps both the message card and bottom CC footer fully in view.
   - Dynamic Island notifications powered by `dynaura` for link copies, CV downloads, and delivery confirmation.

10. **Multi-Tier Email & Serverless Dispatch (`/api/contact.js`)**:
    - **Tier 1 (Serverless Bridge)**: Built-in Vercel Serverless Function `/api/contact` relaying submissions via Web3Forms with direct reply-to, bypassing client-side origin/TLD blocks in < 1 second.
    - **Tier 2 (Direct Web3Forms)**: Client-side gateway with access key authentication.
    - **Tier 3 (ShipMyForm)**: Sub-2s zero-config fallback.
    - **Tier 4 (FormSubmit)**: Secondary public gateway with timeout protection.
    - **Tier 5 (Fail-Safe Mailto)**: Instant `mailto:` client fallback with automatic clipboard copy so messages are never lost.

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

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Optional: Web3Forms Access Key (https://web3forms.com)
VITE_WEB3FORMS_ACCESS_KEY=your-access-key-here

# Optional: EmailJS credentials (https://www.emailjs.com/)
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=

# Optional: Custom SMTP API Endpoint
VITE_SMTP_API_ENDPOINT=
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
# Type-check and compile production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
Portfolio/
├── api/
│   └── contact.js             # Vercel Serverless contact relay (Web3Forms bridge)
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
│   │   ├── AsciiStream.tsx    # WebGL Fullscreen ASCII terminal stream
│   │   ├── ChromaCard.tsx     # Holographic WebGL profile card with SDF corners
│   │   ├── CircleGallery.tsx  # 3D circular project tiles cylinder carousel
│   │   ├── CircuitFlash.tsx   # Cyberpunk circuit accent flash
│   │   ├── Contact.tsx        # M3 contact section & communication suite
│   │   ├── CustomCursor.tsx   # Fluid spring-physics morphing cursor
│   │   ├── Experience.tsx     # Education & leadership horizontal cards
│   │   ├── GlitchHeading.tsx  # Viewport-triggered chromatic glitch effect
│   │   ├── Header.tsx         # Responsive navbar with Colombo time & scroll handlers
│   │   ├── Hero.tsx           # Display typography, telemetry & quick social links
│   │   ├── Lightspeed.tsx     # Hyperspace warp starfield background
│   │   ├── LoadingScreen.tsx  # Initial app loading sequence
│   │   ├── Projects.tsx       # Selected engineering projects showcase
│   │   ├── RisingLines.tsx    # Rising light filament shader animation
│   │   ├── SkillsShowcase.tsx # Categorized technical skills & mastery badges
│   │   ├── SpectralTiles.tsx  # 3D interactive mesh grid
│   │   └── StaggeredText.tsx  # Word-by-word blur-in entrance animation
│   ├── services/
│   │   └── smtpService.ts     # Multi-tier SMTP & email API delivery engine
│   ├── App.tsx                # Application root with theme state & smooth scrolling
│   ├── index.css              # Design tokens, typography variables & theme rules
│   └── main.tsx               # Application DOM entry point
├── index.html                 # HTML template with Google Fonts & JSON-LD schema
├── package.json               # Dependencies and build scripts
├── tailwind.config.js         # Tailwind configuration & typography extensions
├── tsconfig.json              # TypeScript compiler configuration
└── vite.config.ts             # Vite bundler configuration
```

---

## 👤 Author

**Sujeevakumar Sivodayan**
- **University**: Department of Computer Science & Engineering, University of Moratuwa
- **Portfolio**: [https://sivodayan.devs.surf](https://sivodayan.devs.surf)
- **Email**: [sivodayan18@gmail.com](mailto:sivodayan18@gmail.com)
- **GitHub**: [@devsivo](https://github.com/devsivo)
- **LinkedIn**: [sivodayan-sujeevakumar](https://www.linkedin.com/in/sivodayan-sujeevakumar-8096943a4/)

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
