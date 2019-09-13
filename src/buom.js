const makeBot = (platforms, conf) => platforms.split(',').map(p => createBot(p, conf[p]))
var skypeEnabled = process.env.SKYPE || false
function createBot(platform, config) {
  switch (platform) {
    case 'slack':
      const { SlackBot } = require('bottender')
      return new SlackBot(config)
  }
}

const start = (config) => {
  const handler = require('./handlers')

  // Test handlers using console
  if (process.env.CONSOLE === 'true') {
    const { ConsoleBot } = require('bottender')
    const bot = new ConsoleBot().onEvent(handler)
    bot.createRuntime()
  } else {
    const express = require('express')
    const bodyParser = require('body-parser')
    const { registerRoutes } = require('@bottender/express')
    const server = express()
    server.use(
      bodyParser.json({
        verify: (req, res, buf) => {
          req.rawBody = buf.toString()
        }
      })
    )

    const bots = makeBot(process.env.PLATFORMS, config)
    // share handler for all bot
    bots.forEach(b => {
      b.onEvent(handler)
      registerRoutes(server, b, { path: `/${b.connector.platform}${config.slack.apiPostfix}`})
      console.log(`Registered new ${b.connector.platform} bot on path: /${b.connector.platform}${config.slack.apiPostfix}`)
    })

    if (skypeEnabled) {
      require('./skypebot')
        .createSkypeBot(server, handler, config.skype)
    }

    server.listen(config.port || 3978, () => {
      console.log('server is listening')
    })
  }

}

module.exports = {
  start
}
