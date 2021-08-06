uniform float time;
uniform float uProgress;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  vUv = uv;
}