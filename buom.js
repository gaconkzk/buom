const config = require('./buom.config.js')

const makeBot = (platforms) => platforms.split(',').map(p => createBot(p))
var skypeEnabled = process.env.SKYPE || false
function createBot(platform) {
  switch (platform) {
    case 'slack':
      const { SlackBot } = require('bottender')
      return new SlackBot(config.slack)
  }
}

function createSkypeBot(server, handler) {
  const { BotFrameworkAdapter } = require('botbuilder')
  const adapter = new BotFrameworkAdapter({
    appId: config.skype.appId,
    appPassword: config.skype.appPassword
  })

  adapter.onTurnError = async (ctx, err) => {
    console.error(`\n [onTurnError]: ${err}`)
    await ctx.sendActivity('lỗi nặng rồi mấy anh chị ơi!')
  }

  server.post('/skype/api/messages', (req, res) => {
    adapter.processActivity(req, res, async ctx => {
      await handler.run(ctx)
    })
  })
}

const start = (port) => {
  const handler = require('./handler.js')

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

    const bots = makeBot(process.env.PLATFORMS)
    // share handler for all bot
    bots.forEach(b => {
      b.onEvent(handler)
      registerRoutes(server, b, { path: `/${b.connector.platform}${config.slack.apiPostfix}`})
      console.log(`Registered new ${b.connector.platform} bot on path: /${b.connector.platform}${config.slack.apiPostfix}`)
    })

    if (skypeEnabled) {
      const { SkypeHandler } = require('./skypebot')
      createSkypeBot(server, new SkypeHandler(handler))
    }

    server.listen(port || 3978, () => {
      console.log('server is listening')
    })
  }

}

module.exports = {
  start
}
