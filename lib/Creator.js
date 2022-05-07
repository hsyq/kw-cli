const fs = require('fs-extra')
const path = require('path')
const { promisify } = require('util')
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const downloadRepo = promisify(require('download-git-repo'))

const { sleep } = require('./utils')

async function loadingFn(fn, message, ...args) {
  const spinner = ora(message)
  spinner.start()
  try {
    let results = await fn(...args)
    spinner.succeed()
    return results
  } catch (err) {
    spinner.fail(err.message)
    sleep(1000)
    await loadingFn(fn, message, ...args)
  }
}

const repoUrl = 'hsyq/vite-template'

class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName
    this.target = targetDir
  }

  async create(options) {
    let target = path.resolve(process.cwd(), this.name)
    await loadingFn(downloadRepo, '下载模板中', repoUrl, target)
    console.log('下载成功')

    console.log(`
    Success! Created my at ${target}
    Inside that directory, you can run several commands:

    pnpm dev
        Starts the development server.

    pnpm run build
        Bundles the app into static files for production.

    pnpm lint
        Starts the lint runner.

    pnpm lint:fix
        User eslint tool fix code style.

    We suggest that you begin by typing:

      cd ${this.name}
      pnpm install
      pnpm dev

    Happy hacking!
    `)
  }
}

module.exports = Creator