var gl;
var canvas;
var program;
var attrPosition;
var unfmScale;
var unfmAspect;
var triangleMesh = [-1, -.866, 1, -.866, 0, 1];
var triangleBuffer;

var glslVertexSource = `
attribute vec2 position;
uniform float scale;
uniform float aspect;

void main() {
  gl_Position = vec4(position.x / scale / aspect, position.y / scale, 0.5, 1.0);
}
`;

var glslFragmentSource = `
precision mediump float;

void main() {
  gl_FragColor = vec4(.83, 0.43, 0.35, 1.0);
}
`;

function setup() {
  canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("experimental-webgl", {antialias: true}); // get a WebGL context

  gl.clearColor(.05, .23, .3, 1);

  program = createProgram(glslVertexSource, glslFragmentSource);
  attrPosition = gl.getAttribLocation(program, "position");
  unfmScale = gl.getUniformLocation(program, "scale");
  unfmAspect = gl.getUniformLocation(program, "aspect");
  gl.enableVertexAttribArray(attrPosition);
  gl.useProgram(program);

  triangleBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleMesh), gl.STATIC_DRAW);

  gl.uniform1f(unfmScale, 2.2);

  draw(); // start the draw loop
}

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gl.uniform1f(unfmAspect, canvas.width / canvas.height);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
  gl.vertexAttribPointer(attrPosition, 2, gl.FLOAT, false, 4 * 2, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.flush();
  window.requestAnimationFrame(draw);
}

function createShader(source, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("error compiling " + (type == gl.VERTEX_SHADER ? "vertex" : "fragment") + " shader: " + gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(vertexSource, fragmentSource) {
  var program = gl.createProgram();
  var vertexShader = createShader(vertexSource, gl.VERTEX_SHADER);
  var fragmentShader = createShader(fragmentSource, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  return program;
}
