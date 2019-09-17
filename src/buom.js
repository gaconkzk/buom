const MessageProcessor = require('./processor')
const WitAiProcessor = require('./processor/WitAiProcessor')

const consoleBot = require('./consolebot')
const restBots = require('./restbots')

const start = (config) => {
  const processor = new MessageProcessor(config.processor)

  const witai = new WitAiProcessor(config.matchers.witai)
  processor.addMatcher(witai.match)

  if (config.useConsole) {
    consoleBot.start(processor)
  } else {
    restBots.start(processor, config)
  }
}

module.exports = {
  start
}
