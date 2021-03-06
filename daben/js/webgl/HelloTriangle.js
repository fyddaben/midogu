var VSHADER_SOURCE= document.getElementById("vs-tpl").innerHTML;
var FSHADER_SOURCE= document.getElementById("fs-tpl").innerHTML;

function main(){
    var canvas= document.getElementById("webgl");
    //获取会话上下文
    var gl= getWebGLContext(canvas);
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return; 
    }
    //初始化着色器
    if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
        console.log('Failed to initialize shaders');
        return;
    }
    var n= initVertexBuffers(gl); 
    if(n < 0){
        console.log('Failed to set the positions of the vertices'); 
        return ; 
    }
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制三个点
    //gl.drawArrays(gl.POINTS,0,n);
    //线段
    //gl.drawArrays(gl.LINES,0,n);
    gl.drawArrays(gl.TRIANGLES,0,n);
    //gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
}
//利用缓冲区绘制多个点
function initVertexBuffers(gl){
    var vertices= new Float32Array([
        0.5,0.5,0.5,-0.5,-0.5,-0.5,-0.5,0.5 
    ]);
    var n= 4;
    //创建缓冲区
    var vertexBuffer= gl.createBuffer();  
    if(!vertexBuffer){
        console.log('Failed to create the buffer object'); 
        return -1;
    }
    //讲缓冲区对象绑定到目标，确认目标的用途，用于绘制顶点
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer); 
    //向缓冲区对象填充数据，不能直接写入缓冲区，所以要绑定到gl对象
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    //把着色器中变量转换为可以操控的变量    
    var a_Position= gl.getAttribLocation(gl.program,'a_Position');
    //把缓冲区对象分配给attribute变量
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0); 
    //开启attribute变量，使得顶点着色器访问缓冲区内的数据
    gl.enableVertexAttribArray(a_Position);
    return n;
}
