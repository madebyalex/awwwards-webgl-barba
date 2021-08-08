import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import testTexture from 'url:../img/texture.jpg';
import * as dat from 'dat.gui';
import { DoubleSide } from 'three';
import gsap from 'gsap';
import ASScroll from '@ashthornton/asscroll';

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

    this.asscroll = new ASScroll();

    this.asscroll.enable({
      horizontalScroll: true,
    });
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
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);

    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      side: DoubleSide,
      uniforms: {
        time: { value: 1.0 },
        uProgress: { value: this.settings.progress },
        uTexture: { value: new THREE.TextureLoader().load(testTexture) },
        uTextureSize: { value: new THREE.Vector2(100, 100) },
        uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uQuadSize: { value: new THREE.Vector2(250, 250) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.tl = gsap
      .timeline()
      .to(this.material.uniforms.uCorners.value, {
        x: 1,
        duration: 1,
      })
      .to(
        this.material.uniforms.uCorners.value,
        {
          y: 1,
          duration: 1,
        },
        0.2
      )
      .to(
        this.material.uniforms.uCorners.value,
        {
          z: 1,
          duration: 1,
        },
        0.4
      )
      .to(
        this.material.uniforms.uCorners.value,
        {
          w: 1,
          duration: 1,
        },
        0.6
      );

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(300, 300, 1);
    // this.scene.add(this.mesh);
    this.mesh.position.x = 200;
    // this.mesh.rotation.z = 0.5;

    this.images = [...document.querySelectorAll('.js-image')];
    this.materials = [];

    this.imageStore = this.images.map((img) => {
      let bounds = img.getBoundingClientRect();

      let m = this.material.clone();
      this.materials.push(m);

      let texture = new THREE.Texture(img);
      texture.needsUpdate = true;

      m.uniforms.uTexture.value = texture;

      let mesh = new THREE.Mesh(this.geometry, m);
      this.scene.add(mesh);
      mesh.scale.set(bounds.width, bounds.height, 1);

      return {
        img: img,
        mesh: mesh,
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left,
      };
    });
  }

  setPosition() {
    this.imageStore.forEach((o) => {
      o.mesh.position.x =
        -this.asscroll.currentPos + o.left - this.width / 2 + o.width / 2;
      o.mesh.position.y = -o.top + this.height / 2 - o.height / 2;
    });
  }

  render() {
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.setPosition();
    // this.material.uniforms.uProgress.value = this.settings.progress;
    this.tl.progress(this.settings.progress);

    this.mesh.rotation.x = this.time / 2000;
    this.mesh.rotation.y = this.time / 1000;

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({
  domElement: document.getElementById('container'),
});
