export const simpleTriangle = () => {
/* 
0. Написть код на GLSL в качестве источника для шедейдеров - вершинного и фрагментного
1. Создать canvas и получить его в js .Браузер может не поддерживать canvas.
2. Получить контекст const gl = canvas.getContext("webgl");
на событии onload.Установить область рисования.
3.Создать шейдер фрагментного или вершинного типа,лучше написать функцию чтобы не повторять код для каждого шейдера.
4.Прикрепляем к шейдеру источник кода шейдера.
5.Комипилируем шейдер.
6.Создаем объект программы шейдеров.
7.Связываем программу с контекстом webgl.
8.Линкуем программу завершая процесс подготовки GPU кода для программ фрагментного и вершинного шейдера.
9.Устанавливем WebGLProgram как часть текущего рендерного состояния.
10.Установка атрибута программы.
11.Установка буфера вершин,создаем и инициализируем буфер хранящий данные такие как вершины или цвета.
12.Связываем WebGLBuffer к gl.ARRAY_BUFFER.
13.gl.bufferData создает и инициализирует данные объекта буфера.
14.Указываем кол-во точек,в спецификации не казывается откуда взялись поля itemSize и numberOfItems.
15.Устанавливаем цвет фона.
16.Установить области отрисовки.
17.Очистка буфера к заданным значениям или проще, очищаем экран заданым цветом.
18.Указываем, что каждая вершина имеет по три координаты (x, y, z).
19.gl.vertexAttribPointer связывает буфер привязанный к gl.ARRAY_BUFFER в общий вершинный аттрибут текущего вершинного объекта буфера и поределяет его расположение.
20.Отрисовка примитивов - треугольников.
*/

  let gl;
  let shaderProgram;
  let vertexBuffer;

  // источник фрагментного шейдера
  const fragmentShaderSource = `
  void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
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

  // установка буфера вершин
  vertexBuffer = gl.createBuffer(); //создаем и инициализируем буфер хранящий данные такие как вершины или цвета.

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); //связываем WebGLBuffer к gl.ARRAY_BUFFER

  // массив координат вершин объекта,треугольник - 3 точки по 3 координаты на точку.
  var triangleVertices = [
    0.0, 0.7, 0.0,
    -0.7, -0.5, 0.0,
    0.7, -0.5, 0.0,
    // x ,// y ,// z
    //z - Здесь не работает
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
    gl.STATIC_DRAW
  ); // gl.bufferData создает и инициализирует данные объекта буфера.

  // указываем кол-во точек
  //в спецификации не казывается откуда взялись поля itemSize и numberOfItems
  vertexBuffer.itemSize = 3;
  vertexBuffer.numberOfItems = 3;

  // покрасим в красный цвет фон
  gl.clearColor(1.0, 0.0, 0.0, 1.0);

  // установка области отрисовки
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  gl.clear(gl.COLOR_BUFFER_BIT); // очистка буфера к заданным значениям
  // или проще, очищаем экран заданым цветом

  // указываем, что каждая вершина имеет по три координаты (x, y, z)
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    vertexBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  // gl.vertexAttribPointer связывает буфер привязанный к gl.ARRAY_BUFFER
  // в общий вершинный аттрибут текущего вершинного объекта буфера
  // и поределяет его расположение

  // отрисовка примитивов - треугольников
  gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems); // отрисовка примитивов из массива данных
};
