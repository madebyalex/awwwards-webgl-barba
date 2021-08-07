import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import testTexture from 'url:../texture.jpg';
import * as dat from 'dat.gui';
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
      1000
    );

    const cameraDistance = 600;

    this.camera.position.z = cameraDistance;
    this.camera.fov =
      Math.atan(this.height / 2 / cameraDistance) * (180 / Math.PI) * 2;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;
    this.setupSettings();
    this.resize();
    this.addObjects();
    this.render();
    this.setupResize();
  }

  setupSettings() {
    this.settings = {
      progress: 0,
    };

    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'progress', 0, 1, 0.001);
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
    this.geometry = new THREE.PlaneBufferGeometry(250, 250);
    // this.geometry = new THREE.SphereBufferGeometry(0.3, 120, 120);

    // this.material = new THREE.MeshNormalMaterial();
    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      side: DoubleSide,
      uniforms: {
        time: { value: 1.0 },
        uProgress: { value: this.settings.progress },
        uTexture: { value: new THREE.TextureLoader().load(testTexture) },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uQuadSize: { value: new THREE.Vector2(300, 300) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.mesh.position.x = 200;
    this.mesh.rotation.z = 0.5;
  }

  render() {
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.uProgress.value = this.settings.progress;

    this.mesh.rotation.x = this.time / 2000;
    this.mesh.rotation.y = this.time / 1000;

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({
  domElement: document.getElementById('container'),
});
