const { BotFrameworkAdapter } = require('botbuilder')
const SkypeTransformer = require('./SkypeTransformer.js')

class SkypeBot {
  constructor(config) {
    this._connector = new BotFrameworkAdapter({
      appId: config.appId,
      appPassword: config.appPassword
    })

    this._connector.platform = 'skype'
    this._connector.onTurnError = async (ctx, err) => {
      console.error(`\n [onTurnError]: ${err}`)
      await ctx.sendActivity('lỗi nặng rồi mấy anh chị ơi!')
    }
  }

  get connector() {
    return this._connector
  }
}

function registerSkypeRoutes(server, bot, route, handler) {
  const skypeTransformer = new SkypeTransformer(handler)

  server.post(route.path, (req, res) => {
    bot.connector.processActivity(req, res, async ctx => {
      await skypeTransformer.run(ctx)
    })
  })
}

module.exports = {
  SkypeBot,
  registerSkypeRoutes
}
