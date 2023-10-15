import './style.css'
import { resize } from './helper';
const canvas = document.getElementById('canvas')

function createShader(gl, type, source) {
  var shader = gl.createShader(type);   // создание шейдера
  gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
  gl.compileShader(shader);             // компилируем шейдер
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

const main = () => {
  var gl = canvas.getContext("webgl");
console.log(canvas)
if (!gl) {
   // у вас не работает webgl!
   console.log('Отдохни')
  }

// // атрибут, который будет получать данные из буфера
// attribute vec4 a_position;
 
// // все шейдеры имеют функцию main
// void main() {
 
//   // gl_Position - специальная переменная вершинного шейдера,
//   // которая отвечает за установку положения
//   gl_Position = a_position;
// }

// *** ПСЕВДОКОД!! ***
 
var positionBuffer = [
  0, 0, 0, 0,
  0, 0.5, 0, 0,
  0.7, 0, 0, 0,
];
var attributes = {};
var gl_Position;
 
function drawArrays(figure, offset, count) {
  var stride = 4;
  var size = 4;
  for (var i = 0; i < count; ++i) {
     // копировать следующие 4 значения из positionBuffer в атрибут a_position
     const start = offset + i * stride;
     attributes.a_position = positionBuffer.slice(start, start + size);
     runVertexShader();
    //  ...
     doSomethingWith_gl_Position();
    }
  }

//   // фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её
// // указать. mediump подойдёт для большинства случаев. Он означает "средняя точность"
// precision mediump float;
 
// void main() {
//   // gl_FragColor - специальная переменная фрагментного шейдера.
//   // Она отвечает за установку цвета.
//   gl_FragColor = vec4(1, 0, 0.5, 1); // вернёт красновато-фиолетовый
// }

const vertexShaderCode = `
// атрибут, который будет получать данные из буфера
attribute vec4 a_position;

// все шейдеры имеют функцию main
void main() {

  // gl_Position - специальная переменная вершинного шейдера,
  // которая отвечает за установку положения
  gl_Position = a_position;
}
`

const fragmentShaderCode = `
// фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её
  // указать. mediump подойдёт для большинства случаев. Он означает "средняя точность"
  precision mediump float;
 
  void main() {
    // gl_FragColor - специальная переменная фрагментного шейдера.
    // Она отвечает за установку цвета.
    gl_FragColor = vec4(1, 0, 0.5, 1); // вернёт красновато-фиолетовый
  }
`
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

var program = createProgram(gl, vertexShader, fragmentShader);
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// три двумерных точки
var positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
resize(gl)
// очищаем canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
// говорим использовать нашу программу (пару шейдеров)
gl.useProgram(program);
gl.enableVertexAttribArray(positionAttributeLocation);
// Привязываем буфер положений
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 
// Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 компоненты на итерацию
var type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
var normalize = false; // не нормализовать данные
var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
var offset = 0;        // начинать с начала буфера
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset)

    var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 3;
gl.drawArrays(primitiveType, offset, count);
}

main()
