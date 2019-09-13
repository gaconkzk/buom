const { ActivityHandler } = require('botbuilder')

const SkypeContext = require('./SkypeContext')

const SkypeEvent = require('./SkypeEvent')

class SkypeHandler extends ActivityHandler {
  constructor(handler) {
    super()

    this._handler = handler

    this.onMessage(async (ctx, next) => {
      let event = SkypeEvent.make(ctx._activity)
      let bctx = SkypeContext.make(ctx, event)
      await this._handler(bctx)
      await next()
    })

    this.onConversationUpdate(async (ctx, next) => {
      let event = SkypeEvent.make(ctx._activity)
      let bctx = SkypeContext.make(ctx, event)
      await this._handler(bctx)
      await next()
    })
  }
}

module.exports = SkypeHandler
