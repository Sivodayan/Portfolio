/**
 * Eye-Catching, Organic 3D Interactive Canvas (Three.js)
 * - Interactive particle mesh with mouse repulsion
 * - Click-to-shockwave physical ripples
 * - Subtle floating constellation depth
 * - Seamless theme reactivity (Dark / Light)
 */

(function () {
  'use strict';

  let canvas, renderer, scene, camera;
  let particles, geom;
  let count = 0;
  let mouseX = 0, mouseY = 0;
  let mouseWorld = new THREE.Vector3(0, 0, 0);
  let raycaster, plane;
  let ripples = []; // active shockwaves

  const COLS = 55;
  const ROWS = 40;
  const SEPARATION = 42;
  const NUM_PARTICLES = COLS * ROWS;

  // Store original positions for spring return
  let basePositions = new Float32Array(NUM_PARTICLES * 3);
  let currentPositions = new Float32Array(NUM_PARTICLES * 3);
  let velocities = new Float32Array(NUM_PARTICLES * 3);

  function init() {
    canvas = document.getElementById('three-bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 420, 850);

    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster();
    plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    let idx = 0;
    for (let ix = 0; ix < COLS; ix++) {
      for (let iy = 0; iy < ROWS; iy++) {
        const x = ix * SEPARATION - ((COLS * SEPARATION) / 2);
        const y = 0;
        const z = iy * SEPARATION - ((ROWS * SEPARATION) / 2);

        basePositions[idx] = x;
        basePositions[idx + 1] = y;
        basePositions[idx + 2] = z;

        currentPositions[idx] = x;
        currentPositions[idx + 1] = y;
        currentPositions[idx + 2] = z;

        velocities[idx] = 0;
        velocities[idx + 1] = 0;
        velocities[idx + 2] = 0;

        idx += 3;
      }
    }

    geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const mat = new THREE.PointsMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      size: 2.8,
      transparent: true,
      opacity: isDark ? 0.45 : 0.3
    });

    particles = new THREE.Points(geom, mat);
    scene.add(particles);

    // Floating ambient background stars (deeper z-plane)
    const starCount = 80;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let s = 0; s < starCount * 3; s += 3) {
      starPos[s] = (Math.random() - 0.5) * 2500;
      starPos[s + 1] = (Math.random() - 0.5) * 1200 + 200;
      starPos[s + 2] = (Math.random() - 0.5) * 1500 - 200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: isDark ? 0x818cf8 : 0x4f46e5,
      size: 2.0,
      transparent: true,
      opacity: isDark ? 0.35 : 0.2
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Listeners
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('click', onClick);

    // Theme watcher
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.getAttribute('data-theme') !== 'light';
      mat.color.setHex(dark ? 0x38bdf8 : 0x0284c7);
      mat.opacity = dark ? 0.45 : 0.3;
      starMat.color.setHex(dark ? 0x818cf8 : 0x4f46e5);
      starMat.opacity = dark ? 0.35 : 0.2;
    });
    observer.observe(document.documentElement, { attributes: true });

    animate();
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(e) {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;

    mouseX = (e.clientX - window.innerWidth / 2) * 0.35;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.35;

    raycaster.setFromCamera(new THREE.Vector2(normX, normY), camera);
    const intersect = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, intersect)) {
      mouseWorld.copy(intersect);
    }
  }

  function onClick(e) {
    // Spawn a shockwave at the clicked intersection
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(normX, normY), camera);
    const intersect = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, intersect)) {
      ripples.push({
        x: intersect.x,
        z: intersect.z,
        radius: 5,
        maxRadius: 450,
        speed: 9,
        strength: 55
      });
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    // Smooth camera inertia
    camera.position.x += (mouseX - camera.position.x) * 0.025;
    camera.position.y += (-mouseY + 420 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);

    const pos = geom.attributes.position.array;
    count += 0.035;

    // Update ripples
    for (let r = ripples.length - 1; r >= 0; r--) {
      const rip = ripples[r];
      rip.radius += rip.speed;
      rip.strength *= 0.96;
      if (rip.radius > rip.maxRadius || rip.strength < 0.5) {
        ripples.splice(r, 1);
      }
    }

    // Update particle heights with harmonic waves + mouse proximity repulsion + shockwaves
    let i = 0;
    for (let ix = 0; ix < COLS; ix++) {
      for (let iy = 0; iy < ROWS; iy++) {
        const px = pos[i];
        const pz = pos[i + 2];

        // Base harmonic wave
        let targetY = (Math.sin((ix + count) * 0.25) * 32) + (Math.sin((iy + count) * 0.35) * 32);

        // Mouse repulsion physics
        const dx = px - mouseWorld.x;
        const dz = pz - mouseWorld.z;
        const distSq = dx * dx + dz * dz;
        const influenceRadius = 140;

        if (distSq < influenceRadius * influenceRadius) {
          const dist = Math.sqrt(distSq);
          const factor = 1 - (dist / influenceRadius);
          targetY += Math.sin(factor * Math.PI) * 45;
        }

        // Apply ripples shockwave
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const rx = px - rip.x;
          const rz = pz - rip.z;
          const rDist = Math.sqrt(rx * rx + rz * rz);
          const diff = Math.abs(rDist - rip.radius);
          if (diff < 40) {
            const waveIntensity = (1 - diff / 40) * rip.strength;
            targetY += Math.cos((diff / 40) * Math.PI) * waveIntensity;
          }
        }

        // Smooth spring physics on y
        pos[i + 1] += (targetY - pos[i + 1]) * 0.12;

        i += 3;
      }
    }

    geom.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
