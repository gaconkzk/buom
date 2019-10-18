const MessagePrinter = require('./printer')

class MessageHandler {
  constructor(config) {
    this._printer = new MessagePrinter(config.printer || {})
    this._intents = []
    this._intents['unknown'] = {
      go: async (ctx) => {
        this._printer.print(ctx)
      }
    }

    if (config.intents) {
      config.intents.forEach(it => {
        this.registerAction(it)
      })
    }

    this.process = async (ctx) => {
      console.log(`${JSON.stringify(ctx.intent, null, 2)}`)
      let action = this._intents[ctx.intent.type] || this._intents['unknown']
      await action.go(ctx)
    }
  }

  registerAction(intent) {
    switch (intent.name) {
      case 'find.image': {
        const GoogleSearchHandler = require('./GoogleSearchHandler')
        this._intents[intent.name] = new GoogleSearchHandler(intent.envs, this._printer)
      }
    }
  }
}

module.exports = MessageHandler
