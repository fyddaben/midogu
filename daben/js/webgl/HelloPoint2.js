//顶点着色器程序

var VSHADER_SOURCE='attribute vec4 a_Position;attribute float a_PointSize; void main(){gl_Position= a_Position;gl_PointSize=a_PointSize;}'
//片源着色器
var FSHADER_SOURCE=
    //确定精度值
    'precision mediump float;'+
    'uniform vec4 u_FragColor;'+
    'void main(){gl_FragColor= u_FragColor;}'


function main(){
    var canvas= document.getElementById("webgl");
    var gl= getWebGLContext(canvas);
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return; 
    }
    if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
        console.log('Failed to initialize shaders');
        return;
    }
    var a_Position= gl.getAttribLocation(gl.program,'a_Position');
    var a_PointSize= gl.getAttribLocation(gl.program,'a_PointSize');
    var u_FragColor= gl.getUniformLocation(gl.program,'u_FragColor');
    if(a_PointSize){
        console.log("Failed to get the storage location of a_PointSize");
    }
    canvas.onmousedown=function(ev){click(ev,gl,canvas,a_Position)}
    var pointArr=[];
    var g_colors=[];
    function click(ev,gl,canvas,a_Position){
        var x= ev.clientX; 
        var y= ev.clientY;
        var rect= ev.target.getBoundingClientRect();
        var r_x= (x-rect.left-canvas.width/2)/(canvas.width/2);
        var r_y= -(y-rect.top-canvas.height/2)/(canvas.height/2);
        if(r_x<=0.0&& r_y>=0.0){
            g_colors.push([1.0,0.0,0.0,1.0]);     
        }else if(r_x<0.0&& r_y<0.0){
            g_colors.push([0.0,1.0,0.0,1.0]);     
        }else if(r_x>0.0&& r_y<0.0){
            g_colors.push([1.0,1.0,1.0,1.0]);     
        }else{
            g_colors.push([0.0,0.0,1.0,1.0]);     
        }
        pointArr.push([r_x,r_y]);

        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var len= pointArr.length;
        for(var i= 0;i<=(len-1);i++){
            var rgba=g_colors[i];
            var xy= pointArr[i];
            gl.vertexAttrib3f(a_Position,xy[0],xy[1],0.0); 
            gl.vertexAttrib1f(a_PointSize,15.0);
            gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3]);
            gl.drawArrays(gl.POINTS,0,1);
        }
    }
}

