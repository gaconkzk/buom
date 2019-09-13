const { ActivityHandler } = require('botbuilder')

const SkypeContext = require('./SkypeContext')

class SkypeHandler extends ActivityHandler {
  constructor(bhandler) {
    super()

    this._bhandler = bhandler

    this.onMessage(async (ctx, next) => {
      let bctx = this.transformCtx(ctx)
      await bhandler(bctx)
      await next()
    })

    this.onConversationUpdate(async (ctx, next) => {
      let bctx = this.transformCtx(ctx)
      await bhandler(bctx)
      await next()
    })
  }

  transformCtx(ctx) {
    let bctx = new SkypeContext({ client: ctx })
    return bctx
  }
}

module.exports = SkypeHandler
