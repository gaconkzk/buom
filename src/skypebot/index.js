const SkypeHandler = require('./SkypeHandler.js')
const SkypeEvent = require('./SkypeEvent.js')
const SkypeContext = require('./SkypeContext.js')

function createSkypeBot(server, handler, config) {
  const { BotFrameworkAdapter } = require('botbuilder')
  const adapter = new BotFrameworkAdapter({
    appId: config.appId,
    appPassword: config.appPassword
  })

  adapter.onTurnError = async (ctx, err) => {
    console.error(`\n [onTurnError]: ${err}`)
    await ctx.sendActivity('lỗi nặng rồi mấy anh chị ơi!')
  }

  const btHandler = new SkypeHandler(handler)

  console.log(`Registered new skype bot on path: /skype${config.apiPostfix}`)
  server.post('/skype/api/messages', (req, res) => {
    adapter.processActivity(req, res, async ctx => {
      await btHandler.run(ctx)
    })
  })
}

module.exports = {
  SkypeEvent,
  SkypeContext,
  createSkypeBot
}
