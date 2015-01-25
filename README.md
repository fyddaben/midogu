## MIDOGU 项目说明 (￣(エ)￣)ゞ

### 目的 (((o(*ﾟ▽ﾟ*)o)))

* 更好的管理自己做过的历史文件E
* 对于多人的协作，可以共用一套编译器，减少编译工作量

### 菜单 ⊆（⌒◎⌒）⊇
```
	miDogu
		daben
			coffee
			css
			js
			jsmin
			less
				201410
				_lib
					vairable.less
			temp
				201410
					09
						index.html
					InFo.md
		node_modules
		.gitignore
		gulfile.js
		package.json
		README.md

```


### 更好的管理历史文件 ＼(^ω^＼)

例如，在 `daben` 文件夹下，分别是`coffee`,`less`,`js`,`jsmin`等文件夹，用于编译和接受编译后的文件

在`temp`文件夹下，里面是`201410`这个文件夹，然后下一层级为日期`01`等。

在这一级目录下，新增`InFo.md`，里面的格式是酱紫的“ψ(｀∇´)ψ

```
	# 10月份，工作说明

	### 1.初始化页面

	> 主要完成本工程的示例初始化工作
	> 地址: `./09/index.html`

```

> 然后就可以在这个文件里面，写清 `这个月` 所有完成的工作，以便后期查找

### 多人协作  (((*°▽°*)八(*°▽°*)))♪

例如，在`miDogu`下，是`daben`文件夹，同级可以建立`zhangsan`,`lisi`等文件夹，

唯一的要求是，子级需要列出`coffee`,`less`,`js`,`jsmin`等文件夹

如果需要，排除编译，请放在`less`之类的子级文件夹。并以`_`开头起名字。然后这个文件夹就不会编译

然后，具体里面的内容，就可以自定义层级了。因为编译器，只认这个层级的`coffee`,`less`等文件夹

### nginx可以指向 `daben`这一级，这样就可以用`相对路径`去搞定所有的目录引用。(•̀ロ•́)و✧ ~~ 

### 修改配置文件 `node_modules/gulp/node_modules/vinyl-fs/lib/dest/index.js`

```
	   'use strict';


var defaults = require('defaults');

var path = require('path');
var through2 = require('through2');
var mkdirp = require('mkdirp');
var fs = require('graceful-fs');

var writeContents = require('./writeContents');

// 511 = 0777
var processMode = 511 & (~process.umask());

function dest(outFolder, opt) {
    opt = opt || {};
    if (typeof outFolder !== 'string' && typeof outFolder !== 'function') {
        throw new Error('Invalid output folder');
    }

    var options = defaults(opt, {
        cwd: process.cwd()
    });

    if (typeof options.mode === 'string') {
        options.mode = parseInt(options.mode, 8);
    }

    var cwd = path.resolve(options.cwd);
   

    function saveFile(file, enc, cb) {
        var basePath;
        if (typeof outFolder === 'string') {
            basePath = path.resolve(cwd, outFolder);
        }
        if (typeof outFolder === 'function') {
            basePath = path.resolve(cwd, outFolder(file));
        }

        basePath = cwd;
        //这个地方，对于目标文件的*做一下处理
        var path_a = outFolder;
        var path_b = file.relative;
        
        var path_a_array = path_a.split("\/");
        if (path_b.indexOf("./") == -1) {
            path_b = "./" + path_b;
        }
        var path_b_array = path_b.split("\/");
        for (var i in path_a_array) {
            var pathObj = path_a_array[i];
            if (pathObj !== "*") {
                path_b_array[i] = pathObj;
            }
        }
        var newRelativePath = path_b_array.join("\/");

        var writePath = path.resolve(basePath, newRelativePath);
        //这个地方，对于目标文件的*做一下处理
        var writeFolder = path.dirname(writePath);
        // wire up new properties
        file.stat = file.stat ? file.stat : new fs.Stats();
        file.stat.mode = (options.mode || file.stat.mode || processMode);
        file.cwd = cwd;
        file.base = basePath;
        file.path = writePath;

        // mkdirp the folder the file is going in
        mkdirp(writeFolder, function(err) {
              if (err) {
                return cb(err);
              }
              writeContents(writePath, file, cb);
        });
    }

    var stream = through2.obj(saveFile);
    // TODO: option for either backpressure or lossy
    stream.resume();
    return stream;
}

module.exports = dest;

```















