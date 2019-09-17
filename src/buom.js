const MessageProcessor = require('./processor')
const WitAiProcessor = require('./processor/WitAiProcessor')

const MessagePrinter = require('./printer')
const consoleBot = require('./consolebot')
const restBots = require('./restbots')

const start = (config) => {
  const printers = new MessagePrinter(config.printers)
  const handlers = new MessageProcessor(config.handlers, printers)
  const witai = new WitAiProcessor(config.matchers.witai)
  handlers.addMatcher(witai.match)

  if (config.useConsole) {
    consoleBot.start(handlers)
  } else {
    restBots.start(handlers, config)
  }
}

module.exports = {
  start
}
