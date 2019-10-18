const MessageHandler = require('./handler')

class MessageProcessor {
  constructor(config) {
    this._config = config
    this._matchers = []
    this._handler = new MessageHandler(config.handler || {})

    this.addMatcher(helloMatcher)

    this.run = async (ctx) => {
      let i
      for (i = 0; i < this.matchers.length; i++) {
        let matcher = this.matchers[i]
        let intent = await matcher(ctx.event)
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
    matcher.option = this._config[matcher.name]
    this.matchers.push(matcher)
  }
}

const helloMatcher = (event) => {
  let msg = event.text || event.message
  if (msg === 'hi' || msg === 'hello') {
    return {
      type: 'conversation.greeting'
    }
  }
}

module.exports = MessageProcessor
