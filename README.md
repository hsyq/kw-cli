## dev

```bash
mkdir kw-cli
cd kw-cli

pnpm init

pnpm add

mkdir bin
vim bin/kw.js

mkdir src
vim src/index.js


```

```bash
vim src/utils.js
```





配置 package.json
校验 src 文件夹下的代码

```json
"scripts": {
    "lint":"eslint src"
}
```

配置 husky

```json


```

链接全局包
设置在命令下执行 zhu-cli 时调用 bin 目录下的 www 文件

```json
"bin": {
    "kw": "/bin/kw.js"
}

kw.js文件中使用index.js作为入口文件，并且以node环境执行此文件

#! /usr/bin/env node
require('../src/index.js');
```



链接包到全局下使用

```bash
npm link
```

我们已经可以成功的在命令行中使用`zhu-cli`命令，并且可以执行main.js文件！





## 3.解析命令行参数

**commander:The complete solution for node.js command-line interfaces**

先吹一波commander,commander可以自动生成help，解析选项参数！

像这样 `vue-cli --help!`
像这样 `vue-cli create <project-namne>`







### 3.1 使用commander



```javascript
pnpm install commander
```



index.js就是我们的入口文件

```javascript
const program = require('commander');

program.version('0.0.1')
  .parse(process.argv); // process.argv就是用户在命令行中传入的参数
```



执行`kw --help` 是不是已经有一提示了!



这个版本号应该使用的是当前cli项目的版本号，

我们需要动态获取

，并且为了方便我们将常量全部放到util下的`constants`文件夹中

```javascript
const { name, version } = require('../package.json');

module.exports = {
  name,
  version,
};
```



这样我们就可以**动态获取版本号**了

```javascript
const program = require('commander');

const { version } = require('./utils/constants');

program.version(version)
  .parse(process.argv);
```













