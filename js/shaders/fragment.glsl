uniform float time;

varying float pulse;
varying vec2 vUv;

void main() {
  gl_FragColor = vec4( vUv.x,pulse * sin(time * 10.),vUv.y,1.);
}