// Hero scene: a 3D "system architecture" — three tiers of modules with
// data packets travelling between them (client → services → data).
import * as THREE from "three";

const canvas = document.getElementById("scene");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const INK = 0x0b0f19;
const BONE = 0xeef0f5;
const ACCENT = 0xff6a3d;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch {
  canvas.remove();
  throw new Error("WebGL unavailable");
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
const rig = new THREE.Group();
scene.add(rig);

const edgeMat = new THREE.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.55 });
const faintMat = new THREE.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.14 });
const accentEdge = new THREE.LineBasicMaterial({ color: ACCENT });
const solidMat = new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.92 });
const accentSolid = new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.16 });

function module(w, h, d, highlight = false) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, highlight ? accentSolid : solidMat));
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), highlight ? accentEdge : edgeMat));
  return g;
}

function slab(y, size) {
  const geo = new THREE.BoxGeometry(size, 0.04, size);
  const s = new THREE.LineSegments(new THREE.EdgesGeometry(geo), faintMat);
  s.position.y = y;
  rig.add(s);
  // floor grid on each tier
  const grid = new THREE.GridHelper(size, 8, BONE, BONE);
  grid.material.transparent = true;
  grid.material.opacity = 0.06;
  grid.position.y = y;
  rig.add(grid);
}

// Tier layout: [y, modules as [x, z, w, h, d, highlight]]
const tiers = [
  [1.6, [[-0.9, -0.6, 0.9, 0.35, 0.9, false], [0.6, 0.5, 1.2, 0.5, 0.7, true], [0.9, -0.9, 0.6, 0.25, 0.6, false]]],
  [0, [[-1.1, 0.6, 0.7, 0.7, 0.7, false], [0, -0.4, 0.9, 0.45, 0.9, false], [1.1, 0.7, 0.6, 0.9, 0.6, false], [-0.9, -1.1, 0.5, 0.3, 0.5, true]]],
  [-1.6, [[-0.6, 0, 1.4, 0.4, 1.0, false], [1.0, -0.2, 0.8, 0.6, 1.4, false]]],
];

const anchors = [];
tiers.forEach(([y, mods]) => {
  slab(y, 3.6);
  const row = [];
  mods.forEach(([x, z, w, h, d, hl]) => {
    const m = module(w, h, d, hl);
    m.position.set(x, y + h / 2 + 0.02, z);
    m.userData.baseY = m.position.y;
    m.userData.phase = Math.random() * Math.PI * 2;
    rig.add(m);
    row.push(new THREE.Vector3(x, y + 0.02, z));
  });
  anchors.push(row);
});

// Connections between consecutive tiers, drawn as right-angled paths.
const paths = [];
for (let t = 0; t < anchors.length - 1; t++) {
  anchors[t].forEach((a, i) => {
    const b = anchors[t + 1][i % anchors[t + 1].length];
    const mid = (a.y + b.y) / 2;
    const pts = [a.clone(), new THREE.Vector3(a.x, mid, a.z), new THREE.Vector3(b.x, mid, b.z), new THREE.Vector3(b.x, b.y + 0.3, b.z)];
    rig.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), faintMat));
    paths.push(new THREE.CurvePath());
    for (let k = 0; k < pts.length - 1; k++) paths.at(-1).add(new THREE.LineCurve3(pts[k], pts[k + 1]));
  });
}

// Data packets.
const packetGeo = new THREE.BoxGeometry(0.07, 0.07, 0.07);
const packetMat = new THREE.MeshBasicMaterial({ color: ACCENT });
const packets = paths.flatMap((path, i) =>
  [0, 0.5].map((offset) => {
    const m = new THREE.Mesh(packetGeo, packetMat);
    m.userData = { path, t: (offset + i * 0.17) % 1, speed: 0.12 + (i % 3) * 0.03 };
    rig.add(m);
    return m;
  })
);

// Orbit ring for depth.
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(3.1, 0.003, 4, 160),
  new THREE.MeshBasicMaterial({ color: BONE, transparent: true, opacity: 0.18 })
);
ring.rotation.x = Math.PI / 2;
rig.add(ring);

rig.rotation.set(0.12, -0.6, 0);

// ---------- sizing ----------
function resize() {
  const { clientWidth: w, clientHeight: h } = canvas;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const wide = w > 900;
  camera.position.set(0, 2.6, wide ? 12 : 15);
  camera.lookAt(0, 0, 0);
  rig.position.x = wide ? 2.6 : 0;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas);
resize();

// ---------- interaction ----------
const target = { x: 0, y: 0 };
addEventListener("pointermove", (e) => {
  target.x = (e.clientX / innerWidth - 0.5) * 0.5;
  target.y = (e.clientY / innerHeight - 0.5) * 0.25;
});

let visible = true;
new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);

const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  if (!visible) return;
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  rig.rotation.y += ((-0.6 + t * 0.06 + target.x) - rig.rotation.y) * 0.04;
  rig.rotation.x += ((0.12 + target.y) - rig.rotation.x) * 0.04;
  rig.position.y = Math.sin(t * 0.6) * 0.08 - Math.min(scrollY / innerHeight, 1) * 0.8;

  rig.children.forEach((c) => {
    if (c.userData.baseY !== undefined) c.position.y = c.userData.baseY + Math.sin(t * 1.1 + c.userData.phase) * 0.04;
  });
  packets.forEach((p) => {
    p.userData.t = (p.userData.t + dt * p.userData.speed) % 1;
    p.position.copy(p.userData.path.getPointAt(p.userData.t));
  });
  renderer.render(scene, camera);
}

if (reduceMotion) {
  packets.forEach((p) => p.position.copy(p.userData.path.getPointAt(p.userData.t)));
  renderer.render(scene, camera);
  new ResizeObserver(() => renderer.render(scene, camera)).observe(canvas);
} else {
  frame();
}
