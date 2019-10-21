const MessageProcessor = require('./processor')
const consoleBot = require('./consolebot')
const restBots = require('./restbots')

const start = (config) => {
  let botname = config.name
  const processor = new MessageProcessor(botname, config.matchers, config.processor)

  if (config.useConsole) {
    consoleBot.start(processor)
  } else {
    restBots.start(processor, config)
  }
}

module.exports = {
  start
}
