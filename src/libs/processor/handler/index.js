const MessagePrinter = require('./printer')

class MessageHandler {
  constructor(config) {
    this._printer = new MessagePrinter(config.printer || {})
    this._actions = []
    this._actions['unknown'] = {
      go: async (ctx) => {
        await this._printer.print(ctx)
      }
    }

    if (config.intents) {
      config.intents.forEach(it => {
        this.registerAction(it)
      })
    }

    this.process = async (ctx) => {
      let action = this._actions[ctx.intent.type] || this._actions['unknown']
      await action.go(ctx)
    }
  }

  _importAction(intent) {
    let clazz = require(`./${intent.handle}`)
    return new clazz(intent.envs, this._printer)
  }

  registerAction(intent) {
    let action = this._actions[intent.name]
    if (!action) {
      this._actions[intent.name] = this._importAction(intent, this._printer)
    }
  }
}

module.exports = MessageHandler
