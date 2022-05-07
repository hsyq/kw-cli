





# @kw/cli

```
npm install -g @kw/cli
kw create my-project
```







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

先吹一波commander, **commander可以自动生成help，解析选项参数**！

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

```bash
PS D:\demo3\kw-cli> kw --help
Usage: kw [options]

Options:
  -V, --version  output the version number
  -h, --help     display help for command
  

PS D:\demo3\kw-cli> kw --version
1.0.0
```





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



### 3.2 配置指令命令

根据我们想要实现的功能配置执行动作，遍历产生对应的命令:

```javascript
const actionsMap = {
  create: { // 根据模板创建项目
    description: 'create project',
    alias: 'cr',
    examples: [
      'kw create <template-name>',
    ],
  },
    
  config: { // 配置配置文件
    description: 'config info',
    alias: 'c',
    examples: [
      'kw config get <k>',
      'kw config set <k> <v>',
    ],
  },
  
  '*': {
    description: 'command not found',
  },
};

// 循环创建命令
Object.keys(actionsMap).forEach((action) => {
  program
    .command(action) // 命令的名称
    .alias(actionsMap[action].alias) // 命令的别名
    .description(actionsMap[action].description) // 命令的描述
    .action(() => { // 动作
      console.log(action);
    });
});

program.version(version)
  .parse(process.argv);
```



### 3.3 编写help命令

监听help命令打印帮助信息

```javascript
program.on('--help', () => {
  console.log('Examples');
  Object.keys(actionsMap).forEach((action) => {
    (actionsMap[action].examples || []).forEach((example) => {
      console.log(`  ${example}`);
    });
  });
});
```

到现在我们已经把命令行配置的很棒啦，接下来就开始实现对应的功能！



## 4.create命令

create命令的主要作用就是**去git仓库中拉取模板并下载对应的版本到本地**，如果有模板则**根据用户填写的信息渲染好模板**，生成到当前运行命令的目录下

```javascript
action(() => { // 动作
  if (action === '*') { // 如果动作没匹配到说明输入有误
    console.log(acitonMap[action].description);
  } else { // 引用对应的动作文件 将参数传入
    require(path.resolve(__dirname, action))(...process.argv.slice(3));
  }
}
```



根据不同的动作，动态引入对应模块的文件

创建create.js

```javascript
// 创建项目
module.exports = async (projectName) => {
  console.log(projectName);
};
```



执行`kw create project`,可以打印出 `project`



### 4.1 拉取项目

我们需要获取仓库中的所有模板信息，我的模板全部放在了git上，这里就以git为例，我通过axios去获取相关的信息

```bash
pnpm add axios
```

这里借助下github的 [api](https://developer.github.com/v3/)

```javascript
const axios = require('axios');

// 1).获取仓库列表
const fetchRepoList = async () => {
  // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
  const { data } = await axios.get('https://api.github.com/orgs/zhu-cli/repos');
  return data;
};

module.exports = async (projectName) => {
  let repos = await fetchRepoList();
  repos = repos.map((item) => item.name);
  console.log(repos)
};
```



发现在安装的时候**体验很不好没有任何提示,**而且最终的结果我希望是可以供用户选择的！





### 4.2 inquirer & ora

我们来解决上面提到的问题

```bash
pnpm add inquirer ora 
```



```javascript
module.exports = async (projectName) => {
  const spinner = ora('fetching repo list');
  spinner.start(); // 开始loading
  let repos = await fetchRepoList();
  spinner.succeed(); // 结束loading

  // 选择模板
  repos = repos.map((item) => item.name);
  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: repos, // 选择模式
  });
  console.log(repo);
};
```



我们看到的命令行中选择的功能基本都是基于inquirer实现的，可以实现不同的询问方式













