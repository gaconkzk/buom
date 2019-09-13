const start = (config) => {
  const handler = require('./handlers')
  if (config.useConsole) {
    require('./consolebot').start(handler)
  } else {
    require('./restbots').start(handler, config)
  }
}

module.exports = {
  start
}
