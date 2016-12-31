var gl;
var canvas;
var program;
var attrPosition;
var attrColor;
var unfmScale;
var unfmAspect;
var triangleMesh = [
  -1, -.866,
  .2, .6, 1,
  1, -.866,
  .6, 1, .2,
  0, 1,
  1, .2, .6
];
var triangleBuffer;

var glslVertexSource = `
uniform float scale;
uniform float aspect;
attribute vec2 position;
attribute vec3 color;
varying vec3 _color;

void main() {
  gl_Position = vec4(position.x / scale / aspect, position.y / scale, 0.5, 1.0);
  _color = color;
}
`;

var glslFragmentSource = `
precision mediump float;
varying vec3 _color;

void main() {
  gl_FragColor = vec4(_color, 1.0);
}
`;

function setup() {
  canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("experimental-webgl", {antialias: true}); // get a WebGL context

  gl.clearColor(.05, .23, .3, 1); // set the background color to clear with

  // set up GLSL program & extract variable IDs
  program = createProgram(glslVertexSource, glslFragmentSource);
  unfmScale = gl.getUniformLocation(program, "scale");
  unfmAspect = gl.getUniformLocation(program, "aspect");
  attrPosition = gl.getAttribLocation(program, "position");
  attrColor = gl.getAttribLocation(program, "color");

  gl.enableVertexAttribArray(attrPosition);
  gl.enableVertexAttribArray(attrColor);

  gl.useProgram(program);

  // create a buffer on the GPU and upload the triangle mesh to it
  triangleBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleMesh), gl.STATIC_DRAW);

  // tell our shader the scale we want
  gl.uniform1f(unfmScale, 2.2);

  // start the draw loop
  draw();
}

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // set the aspect ratio
  gl.uniform1f(unfmAspect, canvas.width / canvas.height);

  // draw to the whole canvas and clear to the background color
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
  gl.vertexAttribPointer(attrPosition, 2, gl.FLOAT, false, 4 * (2 + 3), 0);
  gl.vertexAttribPointer(attrColor, 3, gl.FLOAT, false, 4 * (2 + 3), 4 * 2);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.flush();
  window.requestAnimationFrame(draw);
}

function createShader(source, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // report any errors from compiling the shader
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
