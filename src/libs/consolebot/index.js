const { ConsoleBot } = require('bottender')

function start(handler) {
  const bot = new ConsoleBot().onEvent(handler.run)
  bot.createRuntime()
}

module.exports = {
  start
}
