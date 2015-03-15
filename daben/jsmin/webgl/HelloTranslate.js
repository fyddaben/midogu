function main(){var e=document.getElementById("webgl"),t=getWebGLContext(e);if(!t)return void console.log("Failed to get the rendering context for WebGL");var r=Math.PI*ANGLE/180,o=Math.cos(r),i=Math.sin(r),n=new Float32Array([o,i,0,0,-i,o,0,0,0,0,1,0,0,0,0,1]);if(!initShaders(t,VSHADER_SOURCE,FSHADER_SOURCE))return void console.log("Failed to initialize shaders");var a=t.getUniformLocation(t.program,"u_xformMatrix");t.uniformMatrix4fv(a,!1,n);var l=initVertexBuffers(t);return 0>l?void console.log("Failed to set the positions of the vertices"):(t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),void t.drawArrays(t.TRIANGLES,0,l))}function initVertexBuffers(e){var t=new Float32Array([.5,-.5,-.5,-.5,-.5,.5]),r=3,o=e.createBuffer();if(!o)return console.log("Failed to create the buffer object"),-1;e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW);var i=e.getAttribLocation(e.program,"a_Position");return e.vertexAttribPointer(i,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(i),r}var VSHADER_SOURCE=document.getElementById("vs-tpl").innerHTML,FSHADER_SOURCE=document.getElementById("fs-tpl").innerHTML,ANGLE=90;