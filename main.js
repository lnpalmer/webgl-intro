var gl;
var canvas;

var glslVertexSource = `
in vec2 vertexPos;

void main() {
  gl_Position = vec4(vertexPos, 0.0, 1.0);
}
`;

var glslFragmentSource = `
#precision mediump float

void main() {
  gl_FragColor = vec4(0.21, 0.33, 0.45, 1.0);
}
`;

function setup() {
  canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("experimental-webgl"); // get a WebGL context

  gl.clearColor(.05, .23, .3, 1);

  var program = createProgram(glslVertexSource, glslFragmentSource);

  draw(); // start the draw loop
}

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.flush();


  window.requestAnimationFrame(draw);
}

function createShader(source, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
}

function createProgram(vertexSource, fragmentSource) {
  var vertexShader = createShader(vertexSource, gl.VERTEX_SHADER);
  var fragmentShader = createShader(fragmentSource, gl.FRAGMENT_SHADER);
}
