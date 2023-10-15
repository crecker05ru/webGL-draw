import * as mat4 from "./mat4";
export const conus3D = () => {
  let gl;
  let shaderProgram;
  var vertexBuffer; // буфер вершин
  var indexBuffer; //буфер индексов
  var colorBuffer; //буфер цветов

  var angle = 2.0; //угол вращения в радианах
  var zTranslation = -2.0; // смещение по оси Z

  var mvMatrix = mat4.create();
  var pMatrix = mat4.create();

  // источник фрагментного шейдера
  const fragmentShaderSource = `
  varying highp vec4 vColor;
  void main(void) {
    gl_FragColor = vColor;
  }
  `;
  // источник вершинного шейдера
  const vertexShaderSource = `
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexColor;
  varying highp vec4 vColor;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
    void main(void) {
       gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vColor = vec4(aVertexColor, 1.0);
    }
    `;

  const handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 39: // стрелка вправо
        angle += 0.1;
        break;
      case 37: // стрелка влево
        angle -= 0.1;
        break;
      case 40: // стрелка вниз
        zTranslation += 0.1;
        break;
      case 38: // стрелка вверх
        zTranslation -= 0.1;
        break;
    }
  };

  // получаем элемент canvas
  var canvas = document.getElementById("canvas");

  // Сначала пытаемся получить стандартный контекст WegGK.
  // Если не получится, обращаемся к экспериментальному контексту
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  document.addEventListener("keydown", handleKeyDown, false);

  // установка размеров области рисования
  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

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

  const setMatrixUniforms = () => {
    gl.uniformMatrix4fv(shaderProgram.ProjMatrix, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.MVMatrix, false, mvMatrix);
  };

  const setupWebGL = () => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    mat4.perspective(
      pMatrix,
      1.04,
      gl.viewportWidth / gl.viewportHeight,
      0.1,
      100.0
    );
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [0, 0, zTranslation]);
    mat4.rotate(mvMatrix, mvMatrix, angle, [0, 1, 0]);
  };

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

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
   
  shaderProgram.MVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.ProjMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");

  // установка буферов вершин и индексов
  const initBuffers = () => {
    // let vertices = [
    //   // лицевая часть
    //   -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,
    //   // задняя часть
    //   -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
    // ];
    let colors = [];

    const drawConus = (length = 3) => {
      const vertArr = []
      const initialPosition = [0.0,0.9,0.0]
      vertArr.push(...initialPosition)
      const N = length
      const R = 1

      for(let i = 0;i < length;i++){
        const X = R * Math.cos((2 * Math.PI) * i/N)
        const Z = R * Math.sin((2 * Math.PI) * i/N)
        vertArr.push(...[X,-0.5,Z])
        colors.push(...[0.0,i % 2 === 0 ? 1.0 : 0.0,i % 2 === 0 ? 0.0 : 1.0])
      }
      vertArr.splice(vertArr.length,0,vertArr[3],vertArr[4],vertArr[5])
      console.log('vertArr',vertArr)
      return vertArr
    }
  //   let  vertices =[ 0.0,  0.9,  0.0, //m0
  // 0.1,  -0.8,  -0.3, //m1
  // -0.3,  -0.8,  0.0, //m2
  // 0.1,  -0.8,  0.3, //m3
  // 0.1,  -0.8,  -0.3, //m4
  // // -1.0,  -0.7,  -0.3, //m5
  // ];

  let vertices = drawConus(9);
  
  let indices = [
      // лицевая часть
      0, 1, 2, 2, 3, 0,
      //нижняя часть
      0, 4, 7, 7, 3, 0,
      // левая боковая часть
      0, 1, 5, 5, 4, 0,
      // правая боковая часть
      2, 3, 7, 7, 6, 2,
      // // верхняя часть
      // 2, 1, 6, 6, 5, 1,
      // // задняя часть
      // 4, 5, 6, 6, 7, 4,
    ];

    // установка буфера вершин
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;
    vertexBuffer.numberOfItems = vertices.length / 3;

    // // создание буфера индексов
    // indexBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // gl.bufferData(
    //   gl.ELEMENT_ARRAY_BUFFER,
    //   new Uint16Array(indices),
    //   gl.STATIC_DRAW
    // );
    // // указываем число индексов это число равно числу индексов
    // indexBuffer.numberOfItems = indices.length;

    // установка цветов для каждой вершины
    // var сolors = [
    //   0.0, 0.0, 0.9, 
    //   0.0, 0.0, 1.0,
    //    0.0, 1.0, 0.0,
    //     0.0, 0.9, 0.0,

    //   0.0, 0.0, 0.7, 
    //   0.0, 0.0, 1.0, 
    //   0.0, 1.0, 0.0, 
    //   0.0, 0.7, 0.0,
    // ];
    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  };

  const draw = () => {
    //   // gl.vertexAttribPointer связывает буфер привязанный к gl.ARRAY_BUFFER
    // // в общий вершинный аттрибут текущего вершинного объекта буфера
    // // и поределяет его расположение
    // gl.vertexAttribPointer(
    //   shaderProgram.vertexPositionAttribute,
    //   vertexBuffer.itemSize,
    //   gl.FLOAT,
    //   false,
    //   0,
    //   0
    // );

    // gl.drawElements(gl.LINES, indexBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      vertexBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(
      shaderProgram.vertexColorAttribute,
      vertexBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.enable(gl.DEPTH_TEST);

    // gl.drawElements(
    //   gl.TRIANGLES,
    //   indexBuffer.numberOfItems,
    //   gl.UNSIGNED_SHORT,
    //   0
    // );
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, indexBuffer.numberOfItems);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexBuffer.numberOfItems);
  };

  // настройка анимации
  const requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback, element) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  (function animloop() {
    initBuffers()
    setupWebGL();
    setMatrixUniforms();
    draw();
    requestAnimFrame(animloop, canvas);
  })();
};
