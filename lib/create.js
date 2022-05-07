const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const Creator = require('./Creator')

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd()

  console.log(`Creating a new project in ${process.cwd()}`)

  const targetDir = path.resolve(cwd, projectName)

  if (fs.existsSync(targetDir) && !options.merge) {
    // 目录已存在，强制覆盖或者询问覆盖
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Merge', value: 'merge' },
            { name: 'Cancel', value: false }
          ]
        }
      ])

      if (!action) {
        // Cancel，退出程序
        return
      } else if (action === 'overwrite') {
        // 覆盖
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
        await fs.remove(targetDir)
      }
    }
  }

  // 创建项目
  const creator = new Creator(projectName, targetDir)
  await creator.create(options)
}


module.exports = (...args) => {
  return create(...args).catch(err => {
    console.log('创建失败', err)
  })
}
