const { ConsoleBot } = require('bottender')

function start(handler) {
  const bot = new ConsoleBot().onEvent(handler)
  bot.createRuntime()
}

module.exports = {
  start
}
