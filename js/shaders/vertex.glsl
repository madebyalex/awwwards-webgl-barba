uniform float time;
uniform float uProgress;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uQuadSize;

varying vec2 vUv;

void main() {
  vec4 defaultState = modelMatrix * vec4( position, 1.0 );
  vec4 fullScreenState = vec4( position, 1.0 );
  fullScreenState.x *= uResolution.x / uQuadSize.x;
  fullScreenState.y *= uResolution.y / uQuadSize.y;

  vec4 finalState = mix(defaultState, fullScreenState, uProgress);

  gl_Position = projectionMatrix * viewMatrix * finalState;

  vUv = uv;
}