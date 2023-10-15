export const simpleConus = () => {
/* 
gl.TRIANGLE_FAN создает набор треугольников по типу веера, которые имеют одну общую точку.
Также, как и в случае с gl.TRIANGLE_STRIP, общее количество треугольников 
будет равно count-2, где count - это и есть количество вершин в буфере 
вершин. То есть опять же чтобы построить три треугольника нам 
потребуется 3+2=5 вершин.
*/

  let gl;
  let shaderProgram;
  var vertexBuffer; // буфер вершин
  var indexBuffer; //буфер индексов

  // источник фрагментного шейдера
  const fragmentShaderSource = `
  void main(void) {
    gl_FragColor = vec4(0.0, 0.7, 0.0, 1.0);
}
`;
  // источник вершинного шейдера
  const vertexShaderSource = `
  attribute vec3 aVertexPosition; // атрибут - переменная

  void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0);
  }
  `;

  // получаем элемент canvas
  var canvas = document.getElementById("canvas");

  // Сначала пытаемся получить стандартный контекст WegGK.
  // Если не получится, обращаемся к экспериментальному контексту
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  // установка размеров области рисования
  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

  //getShader это функция

  // Функция создания шейдера по типу и src источника
  function getShader(type, src) {
    let shader = gl.createShader(type); //создаем шейдер фрагментного или вершинного типа
    //например gl.FRAGMENT_SHADER
    gl.shaderSource(shader, src); // прикрепляем к шейдеру источник кода шейдера
    gl.compileShader(shader); // комипилируем шейдер
    // если шейдер не скомпилировался
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("Ошибка компиляции шейдера: " + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader; //возвращем скомпилированный шейдер и используем дальше в программе
  }

  var fragmentShader = getShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  var vertexShader = getShader(gl.VERTEX_SHADER, vertexShaderSource);
  //создаем объект программы шейдеров
  shaderProgram = gl.createProgram();

  // прикрепляем к ней шейдеры
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  // связываем программу с контекстом webgl

  gl.linkProgram(shaderProgram);
  // линкуем программу завершая процесс подготовки GPU кода для программ фрагментного и вершинного шейдера

  gl.useProgram(shaderProgram); //Устанавливем WebGLProgram как часть текущего рендерного состояния

  // установка атрибута программы
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  );
  // gl.getAttribLocation вовзращает атрибут переменную из WebGLProgram программы

  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute); // включает общий вершинный массив в указанные индексы в список массивов атрибутов

 
let  vertices =[ 0.0,  0.9,  0.0, //m0
  -0.5,  -0.7,  0.0, //m1
  -0.2,  -0.8,  0.0, //m2
  0.2,  -0.8,  0.0, //m3
  0.5,  -0.7,  0.0, //m3
  ];
// установка буфера вершин
vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
// размерность
vertexBuffer.itemSize = 3;
// указываем кол-во вершин - 5
vertexBuffer.numberOfItems = 5;

  // покрасим в красный цвет фон
  gl.clearColor(0.0, 0.0, 1.0, 1.0);

  // установка области отрисовки
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  gl.clear(gl.COLOR_BUFFER_BIT); // очистка буфера к заданным значениям
  // или проще, очищаем экран заданым цветом

  // gl.vertexAttribPointer связывает буфер привязанный к gl.ARRAY_BUFFER
  // в общий вершинный аттрибут текущего вершинного объекта буфера
  // и поределяет его расположение
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
    vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexBuffer.numberOfItems);
};
