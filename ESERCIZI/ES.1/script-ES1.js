import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";

// ---------------- SCENA ----------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(255, 255, 255);

// ---------------- CAMERA ----------------
const camera = new THREE.PerspectiveCamera(
  60,
  1,
  0.1,
  100
);
camera.position.set(3.5, 1.5, 6);

// ---------------- RENDERER ----------------
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
  antialias: true,
});
renderer.setSize(500, 500);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ---------------- CONTROLS ----------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

// ---------------- LUCI ----------------
scene.add(new THREE.AmbientLight(0xffffff, 1));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(3, 3, 3);
scene.add(keyLight);

const fillLight = new THREE.PointLight(0xffffff, 0.8);
fillLight.position.set(-3, -2, 2);
scene.add(fillLight);

// ---------------- CARICA GLB ----------------
const loader = new GLTFLoader();
let currentModel = null;

loader.load(
  "Nahele.glb?v=" + Date.now(),
  (gltf) => {
    currentModel = gltf.scene;

    // SCALA E CENTRAGGIO AUTOMATICO
    const box = new THREE.Box3().setFromObject(currentModel);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 4.7 / maxDim;
    currentModel.scale.setScalar(scaleFactor);

    box.setFromObject(currentModel);
    const center = new THREE.Vector3();
    box.getCenter(center);

    currentModel.position.set(
      -center.x,
      -box.min.y - 1.8,
      -center.z
    );

    scene.add(currentModel);
  },
  (xhr) =>
    console.log(
      `Nahele.glb caricato: ${((xhr.loaded / xhr.total) * 100).toFixed(1)}%`
    ),
  (error) => console.error("Errore caricamento GLB:", error)
);

// ---------------- ROTAZIONE AUTOMATICA ----------------
const autoRotateSpeed = -0.003;
let isInteracting = false;

controls.addEventListener("start", () => {
  isInteracting = true;
});

controls.addEventListener("end", () => {
  isInteracting = false;
});

// ---------------- ANIMAZIONE ----------------
function animate() {
  requestAnimationFrame(animate);

  if (currentModel && !isInteracting) {
    currentModel.rotation.y += autoRotateSpeed;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ---------------- CLEANUP ----------------
window.addEventListener("beforeunload", () => {
  controls.dispose();
  renderer.dispose();

  if (currentModel) {
    currentModel.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        if (child.material.isMaterial) {
          child.material.dispose();
        }
      }
    });
    scene.remove(currentModel);
    currentModel = null;
  }
});