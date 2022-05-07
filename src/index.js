const program = require('commander');
const pkg = require('../package.json')

const axios = require('axios');
const Inquirer = require('inquirer');
const ora = require('ora');

// 1).获取仓库列表
const fetchRepoList = async () => {
  // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
  const { data } = await axios.get('https://api.github.com/orgs/zhu-cli/repos');
  return data;
};

const fetchRepo = async (projectName) => {
  const spinner = ora('fetching repo list...');
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

let { version, name } = pkg;

// 命令集合
const actions = [
  {
    // 根据模板创建项目
    name: 'create',
    description: 'create project',
    alias: 'cr',
    examples: [
      'kw create <template-name>',
    ],
  },

  {
    // 配置配置文件
    name: 'config',
    description: 'config info',
    alias: 'c',
    examples: [
      'kw config get <k>',
      'kw config set <k> <v>',
    ],
  },

  // {
  //   name: '*',
  //   description: 'command not found',
  // },
]


// 循环创建命令
actions.forEach(action => {
  program
    .command(action.name) // 命令的名称
    .alias(action.alias) // 命令的别名
    .description(action.description) // 命令的描述
    .action(() => { // 动作，触发命令后执行的操作
      console.log(action.name);
    });
});

// 监听help命令打印帮助信息
program.on('--help', () => {
  console.log('Examples');
  actions.forEach(action => {
    (action.examples || []).forEach(example => {
      console.log(`  ${example}`);
    });
  });
});


program.version(version)
  .parse(process.argv); // process.argv就是用户在命令行中传入的参数

