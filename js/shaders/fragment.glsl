uniform float time;
uniform sampler2D uTexture;

varying float pulse;
varying vec2 vUv;

void main() {
  // float sinePulse = (1. + sin(vUv.x * 50. + time)) * 0.5;
  // gl_FragColor = vec4( sinePulse, 0., 0.,1.);

  // vec4 myImage = texture(uTexture, vUv);
  vec4 myImage = texture(uTexture, vUv + 0.01 * sin(vUv * 20. + time));
  gl_FragColor = myImage;
}