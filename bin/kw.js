#! /usr/bin/env node

const program = require('commander');
const chalk = require('chalk');

program
  .version(`kw-cli ${require('../package').version}`)
  .usage('<command> [options]')

/* 
   command：
   options：
   actions： 
*/
program
  .command('create <app-name>')
  .description('create a new project powered by kw-cli-service')
  .action((name, options) => {
    require('../lib/create')(name, options)
  })

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`kw <command> --help`)} for detailed usage of given command.`)
  console.log()
})


program.parse(process.argv)
