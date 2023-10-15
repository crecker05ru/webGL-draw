export const resize = (gl) =>  {
  // // получаем размер HTML-элемента canvas
  // var displayWidth  = gl.canvas.clientWidth;
  // var displayHeight = gl.canvas.clientHeight;
 
  // // проверяем, отличается ли размер canvas
  // if (gl.canvas.width  != displayWidth ||
  //   gl.canvas.height != displayHeight) {
 
  //   // подгоняем размер буфера отрисовки под размер HTML-элемента
  //   gl.canvas.width  = displayWidth;
  //   gl.canvas.height = displayHeight;
  //   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // }

  ///////////////////////////////////////////

  var realToCSSPixels = window.devicePixelRatio;

  // Берём заданный браузером размер canvas в CSS-пикселях и вычисляем нужный
  // нам размер, чтобы буфер отрисовки совпадал с ним в действительных пикселях
  var displayWidth  = Math.floor(gl.canvas.clientWidth  * realToCSSPixels);
  var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

  //  проверяем, отличается ли размер canvas
  if (gl.canvas.width  !== displayWidth ||
      gl.canvas.height !== displayHeight) {

    // подгоняем размер буфера отрисовки под размер HTML-элемента
    gl.canvas.width  = displayWidth;
    gl.canvas.height = displayHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
}