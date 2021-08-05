uniform float time;
varying float pulse;

void main() {
  vec3 newPosition = position;
  // newPosition.z = 0.05 * sin(newPosition.x * 30.   + time);
  newPosition.z = 0.05 * sin(length(position) * 30. + time);
  pulse = newPosition.z * 20.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}