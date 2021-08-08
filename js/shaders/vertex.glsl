uniform float time;
uniform float uProgress;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
uniform vec4 uCorners;

varying vec2 vUv;
varying vec2 vSize;

void main() {
  vec4 defaultState = modelMatrix * vec4( position, 1.0 );
  vec4 fullScreenState = vec4( position, 1.0 );
  fullScreenState.x *= uResolution.x / uQuadSize.x;
  fullScreenState.y *= uResolution.y / uQuadSize.y;

  // 2 corners transition
  // float cornersProgress = mix(uCorners.x, uCorners.y, uv.x);

  // 4 corners transition
  float cornersProgress = mix(
    mix(uCorners.x, uCorners.y, uv.y),
    mix(uCorners.w, uCorners.z, uv.y),
    uv.x
  );

  vec4 finalState = mix(defaultState, fullScreenState, cornersProgress);

  vSize = mix(uQuadSize, uResolution, uProgress);

  gl_Position = projectionMatrix * viewMatrix * finalState;

  vUv = uv;
}