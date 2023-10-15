const fragmentShaderSource = `
void main(void) {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

const vertexShaderSource = `
  attribute vec3 aVertexPosition; // атрибут - переменная

  void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0);
  }
  `;

let gl;
let shaderProgram;
let vertexBuffer;

// установка шейдеров
const getShader = (type, src) => {
  let shader = gl.createShader(type); //создаем шейдер фрагментного или вершинного типа
  /*
  The WebGLRenderingContext method createShader() of the WebGL API
  creates a WebGLShader that can then be configured further 
  using WebGLRenderingContext.shaderSource() 
  and WebGLRenderingContext.compileShader().
  createShader(type)
  Parameters
type
Either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER

Return value
A new (WebGLShader).
   */

  //например gl.FRAGMENT_SHADER
  gl.shaderSource(shader, src); // прикрепляем к GL шейдеру источник кода шейдера

  /*
  The WebGLRenderingContext.shaderSource() method
   of the WebGL API sets the source code of a WebGLShader.
   shaderSource(shader, source)
   Parameters
shader
A WebGLShader object in which to set the source code.

source
A string containing the GLSL source code to set.

Return value
None (undefined).
   */

  gl.compileShader(shader); // комипилируем шейдер в бинарные данные для WebGLProgram

  /*
  The WebGLRenderingContext.compileShader() method of the 
  WebGL API compiles a GLSL shader into binary data 
  so that it can be used by a WebGLProgram.
  compileShader(shader)
  Parameters
shader
A fragment or vertex WebGLShader.

Return value
None (undefined).
  */
  // если шейдер не скомпилировался
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    /*
    The WebGLRenderingContext.getShaderParameter() method of the 
    WebGL API returns information about the given shader.
    getShaderParameter(shader, pname)
    Parameters
shader
A WebGLShader to get parameter information from.

pname
A GLenum specifying the information to query. Possible values:

gl.DELETE_STATUS
Returns a GLboolean indicating whether or not the shader is flagged for deletion.

gl.COMPILE_STATUS
Returns a GLboolean indicating whether or not the last shader compilation was successful.

gl.SHADER_TYPE
Returns a GLenum indicating whether the shader is a vertex shader (gl.VERTEX_SHADER) or fragment shader (gl.FRAGMENT_SHADER) object.

Return value
Returns the requested shader information (as specified with pname).
     */
    alert("Ошибка компиляции шейдера: " + gl.getShaderInfoLog(shader));
    /*
    The WebGLRenderingContext.getShaderInfoLog returns the information log 
    for the specified WebGLShader object. 
    It contains warnings, debugging and compile information.
getShaderInfoLog(shader)
Parameters
shader
A WebGLShader to query.

Return value
A string that contains diagnostic messages, warning messages, 
and other information about the last compile operation.
 When a WebGLShader object is initially created, 
its information log will be a string of length 0.
*/
    gl.deleteShader(shader);
    /*
    The WebGLRenderingContext.deleteShader() method of the 
    WebGL API marks a given WebGLShader object for deletion. 
    It will then be deleted whenever the shader is no longer in use. 
    This method has no effect if the shader has already been deleted, 
    and the WebGLShader is automatically marked for deletion when
     it is destroyed by the garbage collector.

     deleteShader(shader)

     Parameters
      shader
      A WebGLShader object to delete.

      Return value
      None (undefined).
     */
    return null;
  }
  return shader; //возвращем скомпилированный шейдер и используем дальше в программе
};
const initShaders = () => {
  // получаем шейдеры
  var fragmentShader = getShader(gl.FRAGMENT_SHADER, fragmentShaderSource); //получаем скомпилированный шейдер
  var vertexShader = getShader(gl.VERTEX_SHADER, vertexShaderSource);
  //создаем объект программы шейдеров
  shaderProgram = gl.createProgram(); //создаем программу - иницилизируем WebGLProgram объект

  /*
  The WebGLRenderingContext.createProgram() method of the 
  WebGL API creates and initializes a WebGLProgram object.
  createProgram()
  Parameters
None.

Return value
A WebGLProgram object that is a combination of two compiled 
WebGLShaders consisting of a vertex shader and a fragment shader 
(both written in GLSL). These are then linked into a usable program.
   */
  // прикрепляем к ней шейдеры
  gl.attachShader(shaderProgram, vertexShader); //прикрепляем к программе либо шейдер,либо вершину
  /*
  The WebGLRenderingContext.attachShader() method of the 
  WebGL API attaches either a fragment or vertex WebGLShader
  to a WebGLProgram.
  attachShader(program, shader)
  Parameters
program
A WebGLProgram.

shader
A fragment or vertex WebGLShader.
   */
  gl.attachShader(shaderProgram, fragmentShader);
  // связываем программу с контекстом webgl
  gl.linkProgram(shaderProgram); // линкуем программу завершая процесс подготовки GPU кода для программ фрагментного и вершинного шейдера

  /*
  The WebGLRenderingContext interface's linkProgram() method links 
  a given WebGLProgram, completing the process of preparing the GPU
  code for the program's fragment and vertex shaders.
  linkProgram(program)
  Parameters
program
The WebGLProgram to link.

Return value
None (undefined).
   */

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    // получаем статус программы
    /*
    The WebGLRenderingContext.getProgramParameter() method of the 
    WebGL API returns information about the given program.
    getProgramParameter(program, pname)

    Parameters
program
A WebGLProgram to get parameter information from.

pname
A GLenum specifying the information to query. Possible values:

gl.DELETE_STATUS
Returns a GLboolean indicating whether or not the program is flagged for deletion.

gl.LINK_STATUS
Returns a GLboolean indicating whether or not the last link operation was successful.

gl.VALIDATE_STATUS
Returns a GLboolean indicating whether or not the last validation operation was successful.

gl.ATTACHED_SHADERS
Returns a GLint indicating the number of attached shaders to a program.

gl.ACTIVE_ATTRIBUTES
Returns a GLint indicating the number of active attribute variables to a program.

gl.ACTIVE_UNIFORMS
Returns a GLint indicating the number of active uniform variables to a program.

When using a WebGL 2 context, the following values are available additionally:

gl.TRANSFORM_FEEDBACK_BUFFER_MODE
Returns a GLenum indicating the buffer mode when transform feedback is active. May be gl.SEPARATE_ATTRIBS or gl.INTERLEAVED_ATTRIBS.

gl.TRANSFORM_FEEDBACK_VARYINGS
Returns a GLint indicating the number of varying variables to capture in transform feedback mode.

gl.ACTIVE_UNIFORM_BLOCKS
Returns a GLint indicating the number of uniform blocks containing active uniforms.

Return value
Returns the requested program information (as specified with pname).
     */
    alert("Не удалось установить шейдеры");
  }

  gl.useProgram(shaderProgram); //Устанавливем WebGLProgram как часть текущего рендерного состояния
  /*
  The WebGLRenderingContext.useProgram() method of the 
  WebGL API sets the specified WebGLProgram as part 
  of the current rendering state.

  useProgram(program)
  Parameters
program
A WebGLProgram to use.

Return value
None (undefined).
   */
  // установка атрибута программы
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  ); // gl.getAttribLocation вовзращает атрибут переменную из WebGLProgram программы
  /*
  The WebGLRenderingContext.getAttribLocation() method of the 
  WebGL API returns the location of an attribute variable in 
  a given WebGLProgram.
  getAttribLocation(program, name)
  Parameters
program
A WebGLProgram containing the attribute variable.

name
A string specifying the name of the attribute variable whose location to get.

Return value
A GLint number indicating the location of the variable name if found. Returns -1 otherwise.
   */
  // подключаем атрибут для использования
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute); // включает общий вершинный массив в указанные индексы в список массивов атрибутов
  /*
  The WebGLRenderingContext method enableVertexAttribArray(), 
  part of the WebGL API, turns on the generic vertex attribute 
  array at the specified index into the list of attribute arrays.

  Note: You can disable the attribute array by calling disableVertexAttribArray().

  In WebGL, values that apply to a specific vertex are stored in attributes. These are only available to the JavaScript code and the vertex shader. Attributes are referenced by an index number into the list of attributes maintained by the GPU. Some vertex attribute indices may have predefined purposes, depending on the platform and/or the GPU. Others are assigned by the WebGL layer when you create the attributes.

  Either way, since attributes cannot be used unless enabled, and are disabled by default, you need to call enableVertexAttribArray() to enable individual attributes so that they can be used. Once that's been done, other methods can be used to access the attribute, including vertexAttribPointer(), vertexAttrib*(), and getVertexAttrib().

  enableVertexAttribArray(index)

  Parameters
index
A GLuint specifying the index number that uniquely identifies the vertex attribute to enable. If you know the name of the attribute but not its index, you can get the index by calling getAttribLocation().

Return value
None (undefined).

Errors
To check for errors after calling enableVertexAttribArray(), call getError().

WebGLRenderingContext.INVALID_VALUE
The specified index is invalid; that is, it's greater than or equal to the maximum number of entries permitted in the context's vertex attribute list, as indicated by the value of WebGLRenderingContext.MAX_VERTEX_ATTRIBS.
  */
};
// Функция создания шейдера по типу и src источника

// установка буфера вершин
const initBuffers = () => {
  // установка буфера вершин
  vertexBuffer = gl.createBuffer(); //создаем и нициализируем буфер хранящий данные
  // такие как вершины или цвета.
  /**
  The WebGLRenderingContext.createBuffer() method of the
   WebGL API creates and initializes a WebGLBuffer storing 
   data such as vertices or colors.
   
   createBuffer()
   Parameters
None.

Return value
A WebGLBuffer storing data such as vertices or colors.
   */
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); //связываем WebGLBuffer к gl.ARRAY_BUFFER
  /*
  The WebGLRenderingContext.bindBuffer() method of the
  WebGL API binds a given WebGLBuffer to a target.

  bindBuffer(target, buffer)

  Parameters
target
A GLenum specifying the binding point (target). Possible values:

gl.ARRAY_BUFFER
Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.

gl.ELEMENT_ARRAY_BUFFER
Buffer used for element indices.

When using a WebGL 2 context, the following values are available additionally:

gl.COPY_READ_BUFFER
Buffer for copying from one buffer object to another.

gl.COPY_WRITE_BUFFER
Buffer for copying from one buffer object to another.

gl.TRANSFORM_FEEDBACK_BUFFER
Buffer for transform feedback operations.

gl.UNIFORM_BUFFER
Buffer used for storing uniform blocks.

gl.PIXEL_PACK_BUFFER
Buffer used for pixel transfer operations.

gl.PIXEL_UNPACK_BUFFER
Buffer used for pixel transfer operations.

buffer
A WebGLBuffer to bind.

Return value
None (undefined).

Exceptions
Only one target can be bound to a given WebGLBuffer. An attempt to bind the buffer to another target will throw an INVALID_OPERATION error and the current buffer binding will remain the same.

A WebGLBuffer which has been marked for deletion with deleteBuffer cannot be (re-)bound. An attempt to do so will generate an INVALID_OPERATION error, and the current binding will remain untouched.
   */
  // массив координат вершин объекта,треугольник - 3 точки по 3 координаты на точку.
  var triangleVertices = [
    0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0,
    // x ,// y ,// z
    //z - Здесь не работает
  ];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
    gl.STATIC_DRAW
  ); // gl.bufferData создает и инициализирует данные объекта буфера.
  /*
   The WebGLRenderingContext.bufferData() method of the 
   WebGL API initializes and creates the buffer object's data store.

Usage
  // WebGL1
bufferData(target, usage)
bufferData(target, size, usage)
bufferData(target, srcData, usage)

// WebGL2
bufferData(target, usage, srcOffset)
bufferData(target, srcData, usage, srcOffset)
bufferData(target, srcData, usage, srcOffset, length)

Parameters
target
A GLenum specifying the binding point (target). Possible values:

gl.ARRAY_BUFFER
Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.

gl.ELEMENT_ARRAY_BUFFER
Buffer used for element indices.

When using a WebGL 2 context, the following values are available additionally:

gl.COPY_READ_BUFFER
Buffer for copying from one buffer object to another.

gl.COPY_WRITE_BUFFER
Buffer for copying from one buffer object to another.

gl.TRANSFORM_FEEDBACK_BUFFER
Buffer for transform feedback operations.

gl.UNIFORM_BUFFER
Buffer used for storing uniform blocks.

gl.PIXEL_PACK_BUFFER
Buffer used for pixel transfer operations.

gl.PIXEL_UNPACK_BUFFER
Buffer used for pixel transfer operations.

size
A GLsizeiptr setting the size in bytes of the buffer object's data store.

srcData Optional
An ArrayBuffer, SharedArrayBuffer, a TypedArray or a DataView that will be copied into the data store. If null, a data store is still created, but the content is uninitialized and undefined.

usage
A GLenum specifying the intended usage pattern of the data store for optimization purposes. Possible values:

gl.STATIC_DRAW
: The contents are intended to be specified once by the application, and used many times as the source for WebGL drawing and image specification commands.
gl.DYNAMIC_DRAW
: The contents are intended to be respecified repeatedly by the application, and used many times as the source for WebGL drawing and image specification commands.
gl.STREAM_DRAW
: The contents are intended to be specified once by the application, and used at most a few times as the source for WebGL drawing and image specification commands.
When using a WebGL 2 context, the following values are available additionally:
gl.STATIC_READ
The contents are intended to be specified once by reading data from WebGL, and queried many times by the application.

gl.DYNAMIC_READ
The contents are intended to be respecified repeatedly by reading data from WebGL, and queried many times by the application.

gl.STREAM_READ
The contents are intended to be specified once by reading data from WebGL, and queried at most a few times by the application

gl.STATIC_COPY
The contents are intended to be specified once by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands.

gl.DYNAMIC_COPY
The contents are intended to be respecified repeatedly by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands.

gl.STREAM_COPY
The contents are intended to be specified once by reading data from WebGL, and used at most a few times as the source for WebGL drawing and image specification commands.

srcOffset
A GLuint specifying the element index offset where to start reading the buffer.

length Optional
A GLuint defaulting to 0.

Return value
None (undefined).
   */
  // указываем кол-во точек
  //в спецификации не казывается откуда взялись поля itemSize и numberOfItems
  vertexBuffer.itemSize = 3;
  vertexBuffer.numberOfItems = 3;
};
// отрисовка
const draw = () => {
  // установка области отрисовки
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  /*
   The WebGLRenderingContext.viewport() method of the 
   WebGL API sets the viewport, which specifies the affine 
   transformation of x and y from normalized device 
   coordinates to window coordinates.

   viewport(x, y, width, height)

   Parameters
x
A GLint specifying the horizontal coordinate for the lower left corner of the viewport origin. Default value: 0.

y
A GLint specifying the vertical coordinate for the lower left corner of the viewport origin. Default value: 0.

width
A non-negative GLsizei specifying the width of the viewport. Default value: width of the canvas.

height
A non-negative GLsizei specifying the height of the viewport. Default value: height of the canvas.

Return value
None (undefined).
   */

  gl.clear(gl.COLOR_BUFFER_BIT); // очистка буфера к заданным значениям
  // или проще, очищаем экран заданым цветом

  /**
The WebGLRenderingContext.clear() method of the WebGL API 
clears buffers to preset values.

The preset values can be set by clearColor(), clearDepth() or clearStencil().

The scissor box, dithering, and buffer writemasks can affect the clear() method.

clear(mask)

Parameters
mask
A GLbitfield bitwise OR mask that indicates the buffers to be cleared. Possible values are:

gl.COLOR_BUFFER_BIT
gl.DEPTH_BUFFER_BIT
gl.STENCIL_BUFFER_BIT
Return value
None (undefined).

Exceptions
If mask is not one of the listed possible values, a gl.INVALID_ENUM error is thrown.
  */

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

  /*
  The WebGLRenderingContext.vertexAttribPointer() method of the 
  WebGL API binds the buffer currently bound to gl.ARRAY_BUFFER 
  to a generic vertex attribute of the current vertex buffer object 
  and specifies its layout.
 
  vertexAttribPointer(index, size, type, normalized, stride, offset)

  Parameters
index
A GLuint specifying the index of the vertex attribute that is to be modified.

size
A GLint specifying the number of components per vertex attribute. Must be 1, 2, 3, or 4.

type
A GLenum specifying the data type of each component in the array. Possible values:

gl.BYTE: signed 8-bit integer, with values in [-128, 127]
gl.SHORT: signed 16-bit integer, with values in [-32768, 32767]
gl.UNSIGNED_BYTE: unsigned 8-bit integer, with values in [0, 255]
gl.UNSIGNED_SHORT: unsigned 16-bit integer, with values in [0,65535]
gl.FLOAT: 32-bit IEEE floating point number
When using a WebGL 2 context, the following values are available additionally:

gl.HALF_FLOAT: 16-bit IEEE floating point number
gl.INT: 32-bit signed binary integer
gl.UNSIGNED_INT: 32-bit unsigned binary integer
gl.INT_2_10_10_10_REV: 32-bit signed integer with values in [-512, 511]
gl.UNSIGNED_INT_2_10_10_10_REV: 32-bit unsigned integer with values in [0, 1023]
normalized
A GLboolean specifying whether integer data values should be normalized into a certain range when being cast to a float.

For types gl.BYTE and gl.SHORT, normalizes the values to [-1, 1] if true.
For types gl.UNSIGNED_BYTE and gl.UNSIGNED_SHORT, normalizes the values to [0, 1] if true.
For types gl.FLOAT and gl.HALF_FLOAT, this parameter has no effect.
stride
A GLsizei specifying the offset in bytes between the beginning of consecutive vertex attributes. Cannot be negative or larger than 255. If stride is 0, the attribute is assumed to be tightly packed, that is, the attributes are not interleaved but each attribute is in a separate block, and the next vertex' attribute follows immediately after the current vertex.

offset
A GLintptr specifying an offset in bytes of the first component in the vertex attribute array. Must be a multiple of the byte length of type.

Return value
None (undefined).

  */

  // отрисовка примитивов - треугольников
  gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems); // отрисовка примитивов из массива данных

  /*
  The WebGLRenderingContext.drawArrays() method of the WebGL API
  renders primitives from array data.

  drawArrays(mode, first, count)

  Parameters
mode
A GLenum specifying the type primitive to render. Possible values are:

gl.POINTS: Draws a single dot.
gl.LINE_STRIP: Draws a straight line to the next vertex.
gl.LINE_LOOP: Draws a straight line to the next vertex, and connects the last vertex back to the first.
gl.LINES: Draws a line between a pair of vertices.
gl.TRIANGLE_STRIP
gl.TRIANGLE_FAN
gl.TRIANGLES: Draws a triangle for a group of three vertices.
first
A GLint specifying the starting index in the array of vector points.

count
A GLsizei specifying the number of indices to be rendered.

Return value
None (undefined).

Exceptions
If mode is not one of the accepted values, a gl.INVALID_ENUM error is thrown.
If first or count are negative, a gl.INVALID_VALUE error is thrown.
if gl.CURRENT_PROGRAM is null, a gl.INVALID_OPERATION error is thrown.
  */
};

export function init() {
  // получаем элемент canvas
  var canvas = document.getElementById("canvas");
  try {
    // Сначала пытаемся получить стандартный контекст WegGK.
    // Если не получится, обращаемся к экспериментальному контексту
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  } catch (e) {}

  // Если контекст не удалось получить, выводим сообщение
  if (!gl) {
    alert("Ваш браузер не поддерживает WebGL");
  }
  if (gl) {
    // установка размеров области рисования
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    // установка шейдеров
    initShaders();
    // установка буфера вершин
    initBuffers();
    // покрасим в красный цвет фон
    gl.clearColor(1.0, 0.0, 0.0, 1.0);

    /**
    The WebGLRenderingContext.clearColor() method of the WebGL API 
    specifies the color values used when clearing color buffers.

    This specifies what color values to use when calling the 
    clear() method. The values are clamped between 0 and 1.

    clearColor(red, green, blue, alpha)

    Parameters
red
A GLclampf specifying the red color value used when the color buffers are cleared. Default value: 0.

green
A GLclampf specifying the green color value used when the color buffers are cleared. Default value: 0.

blue
A GLclampf specifying the blue color value used when the color buffers are cleared. Default value: 0.

alpha
A GLclampf specifying the alpha (transparency) value used when the color buffers are cleared. Default value: 0.

Return value
None (undefined).
*/

    // отрисовка сцены
    draw();
  }
}

// document.addEventListener("load",init)
