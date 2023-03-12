
import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import "../styles.css";
//scene
const scene = new THREE.Scene();

//create our sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: '#00ff83', emissive: '#001f00', roughness: 0.2, wireframe: true});

const mesh = new THREE.Mesh(geometry,material);

scene.add(mesh);

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0,10,10);
light.intensity = 1.25;
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(45,sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);

//renderer
const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;
//resize
window.addEventListener('resize', () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //update camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
})

const loop = () => {
  controls.update();
  renderer.render(scene,camera);
  window.requestAnimationFrame(loop);
};
loop();

//timeline magic
const tl = gsap.timeline({ defaults: {duration: 1}});
tl.fromTo(mesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1})
tl.fromTo('nav', { y: '-100%' }, { y: "0%" });
tl.fromTo(".title", {opacity: 0}, {opacity: 1});

//Mouse Animation Color
let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => {
  mouseDown = true;
})
window.addEventListener('mouseup', () => {
  mouseDown = true;
})

window.addEventListener('mousemove', (e) => {
  if(mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.width) * 255),
      150,
    ]
    //lets animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b});
  }
})