
function main(){
    var canvas= document.getElementById("webgl");
    
    var gl= getWebGLContext(canvas);

    if(!gl){
        console.log("Failed to get the rendering context for WebGl");
        return;
    }
    //设置背景色 
    gl.clearColor(0,0,0,1);
    //这才是动作，清空绘图区域
    gl.clear(gl.COLOR_BUFFER_BIT);
    
}
