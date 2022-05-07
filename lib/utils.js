const sleep = (n = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, n)
  })
}

module.exports = {
  sleep
}