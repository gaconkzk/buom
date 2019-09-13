const handlers = require('./handlers')
const consoleBot = require('./consolebot')
const restBots = require('./restbots')

const start = (config) => {
  if (config.useConsole) {
    consoleBot.start(handlers)
  } else {
    restBots.start(handlers, config)
  }
}

module.exports = {
  start
}
