const MessageHandler = require('./handler')

class MessageProcessor {
  constructor(botname, matchers, config) {
    this._matchers = []
    this._handler = new MessageHandler(config.handler || {})

    Object.keys(matchers).forEach(m => {
      let config = matchers[m]
      let clazz = require(`./matcher/${config.type}`)
      let matcher = new clazz(config, botname)
      this.addMatcher(matcher)
    })

    this.run = async (ctx) => {
      let i
      for (i = 0; i < this.matchers.length; i++) {
        let matcher = this.matchers[i]
        let intent = await matcher.match(ctx.event)
        if (intent) {
          ctx.intent = intent
          await this._handler.process(ctx)
          break
        }
      }

      if (i == this.matchers.length) {
        ctx.intent = { type: 'unknown' }
        await this._handler.process(ctx)
      }
    }
  }

  get matchers() {
    return this._matchers
  }

  addMatcher(matcher) {
    this.matchers.push(matcher)
  }
}

module.exports = MessageProcessor
