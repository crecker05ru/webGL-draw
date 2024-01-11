(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function o(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(t){if(t.ep)return;t.ep=!0;const i=o(t);fetch(t.href,i)}})();const O=1e-6;let T=typeof Float32Array<"u"?Float32Array:Array;function _(){let e=new T(16);return T!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function I(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function V(e,r,o){let a=o[0],t=o[1],i=o[2],n,m,A,h,s,f,b,g,p,x,w,R;return r===e?(e[12]=r[0]*a+r[4]*t+r[8]*i+r[12],e[13]=r[1]*a+r[5]*t+r[9]*i+r[13],e[14]=r[2]*a+r[6]*t+r[10]*i+r[14],e[15]=r[3]*a+r[7]*t+r[11]*i+r[15]):(n=r[0],m=r[1],A=r[2],h=r[3],s=r[4],f=r[5],b=r[6],g=r[7],p=r[8],x=r[9],w=r[10],R=r[11],e[0]=n,e[1]=m,e[2]=A,e[3]=h,e[4]=s,e[5]=f,e[6]=b,e[7]=g,e[8]=p,e[9]=x,e[10]=w,e[11]=R,e[12]=n*a+s*t+p*i+r[12],e[13]=m*a+f*t+x*i+r[13],e[14]=A*a+b*t+w*i+r[14],e[15]=h*a+g*t+R*i+r[15]),e}function U(e,r,o,a){let t=a[0],i=a[1],n=a[2],m=Math.sqrt(t*t+i*i+n*n),A,h,s,f,b,g,p,x,w,R,C,L,l,u,d,F,c,P,M,y,v,S,E,B;return m<O?null:(m=1/m,t*=m,i*=m,n*=m,A=Math.sin(o),h=Math.cos(o),s=1-h,f=r[0],b=r[1],g=r[2],p=r[3],x=r[4],w=r[5],R=r[6],C=r[7],L=r[8],l=r[9],u=r[10],d=r[11],F=t*t*s+h,c=i*t*s+n*A,P=n*t*s-i*A,M=t*i*s-n*A,y=i*i*s+h,v=n*i*s+t*A,S=t*n*s+i*A,E=i*n*s-t*A,B=n*n*s+h,e[0]=f*F+x*c+L*P,e[1]=b*F+w*c+l*P,e[2]=g*F+R*c+u*P,e[3]=p*F+C*c+d*P,e[4]=f*M+x*y+L*v,e[5]=b*M+w*y+l*v,e[6]=g*M+R*y+u*v,e[7]=p*M+C*y+d*v,e[8]=f*S+x*E+L*B,e[9]=b*S+w*E+l*B,e[10]=g*S+R*E+u*B,e[11]=p*S+C*E+d*B,r!==e&&(e[12]=r[12],e[13]=r[13],e[14]=r[14],e[15]=r[15]),e)}function D(e,r,o,a,t){const i=1/Math.tan(r/2);if(e[0]=i/o,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=i,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,t!=null&&t!==1/0){const n=1/(a-t);e[10]=(t+a)*n,e[14]=2*t*a*n}else e[10]=-1,e[14]=-2*a;return e}const N=D,q=()=>{let e,r;var o,a,t=1,i=-2,n=_(),m=_();const A=`
  varying highp vec4 vColor;
  void main(void) {
    gl_FragColor = vColor;
  }
  `,h=`
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexColor;
  varying highp vec4 vColor;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
    void main(void) {
       gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vColor = vec4(aVertexColor, 1.0);
    }
    `,s=l=>{switch(l.keyCode){case 39:t+=.1;break;case 37:t-=.1;break;case 40:i+=.1;break;case 38:i-=.1;break}};var f=document.getElementById("canvas");e=f.getContext("webgl")||f.getContext("experimental-webgl"),document.addEventListener("keydown",s,!1),e.viewportWidth=f.width,e.viewportHeight=f.height;function b(l,u){let d=e.createShader(l);return e.shaderSource(d,u),e.compileShader(d),e.getShaderParameter(d,e.COMPILE_STATUS)?d:(alert("Ошибка компиляции шейдера: "+e.getShaderInfoLog(d)),e.deleteShader(d),null)}const g=()=>{e.uniformMatrix4fv(r.ProjMatrix,!1,m),e.uniformMatrix4fv(r.MVMatrix,!1,n)},p=()=>{e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.viewport(0,0,e.viewportWidth,e.viewportHeight),N(m,1.04,e.viewportWidth/e.viewportHeight,.1,100),I(n),V(n,n,[0,0,i]),U(n,n,t,[0,1,0])};var x=b(e.FRAGMENT_SHADER,A),w=b(e.VERTEX_SHADER,h);r=e.createProgram(),e.attachShader(r,w),e.attachShader(r,x),e.linkProgram(r),e.useProgram(r),r.vertexPositionAttribute=e.getAttribLocation(r,"aVertexPosition"),e.enableVertexAttribArray(r.vertexPositionAttribute),r.vertexColorAttribute=e.getAttribLocation(r,"aVertexColor"),e.enableVertexAttribArray(r.vertexColorAttribute),r.MVMatrix=e.getUniformLocation(r,"uMVMatrix"),r.ProjMatrix=e.getUniformLocation(r,"uPMatrix");const R=()=>{let l=[],d=((F=3)=>{const c=[],P=[0,.9,0];c.push(...P);const M=F,y=1;for(let v=0;v<F;v++){const S=y*Math.cos(2*Math.PI*v/M),E=y*Math.sin(2*Math.PI*v/M);c.push(S,-.5,E),l.push(0,v%2===0?1:0,v%2===0?0:1)}return c.splice(c.length,0,c[3],c[4],c[5]),console.log("vertArr",c),c})(13);o=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array(d),e.STATIC_DRAW),o.itemSize=3,o.numberOfItems=d.length/3,a=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,a),e.bufferData(e.ARRAY_BUFFER,new Float32Array(l),e.STATIC_DRAW)},C=()=>{e.bindBuffer(e.ARRAY_BUFFER,o),e.vertexAttribPointer(r.vertexPositionAttribute,o.itemSize,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,a),e.vertexAttribPointer(r.vertexColorAttribute,o.itemSize,e.FLOAT,!1,0,0),e.enable(e.DEPTH_TEST),e.drawArrays(e.TRIANGLE_FAN,0,o.numberOfItems)},L=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(l,u){return window.setTimeout(l,1e3/60)}}();(function l(){R(),p(),g(),C(),L(l,f)})()};document.addEventListener("load",q());