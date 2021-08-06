import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import testTexture from 'url:../water.jpg';
import { DoubleSide } from 'three';

export default class Sketch {
  constructor(options) {
    this.container = options.domElement;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    );
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;
    this.resize();
    this.addObjects();
    this.render();
    this.setupResize();
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  addObjects() {
    // this.geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5, 75, 75, 20);
    // this.geometry = new THREE.CylinderBufferGeometry(0.2, 0.2, 0.5, 40, 20);
    // this.geometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 30, 30);
    this.geometry = new THREE.SphereBufferGeometry(0.3, 80, 80);

    // this.material = new THREE.MeshNormalMaterial();
    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      side: DoubleSide,
      uniforms: {
        time: { value: 1.0 },
        uTexture: { value: new THREE.TextureLoader().load(testTexture) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  render() {
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.mesh.rotation.x = this.time / 2000;
    this.mesh.rotation.y = this.time / 1000;

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({
  domElement: document.getElementById('container'),
});
