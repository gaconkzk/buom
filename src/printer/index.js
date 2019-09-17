const data = require('./default-data.json')

const pickRan = (items) => items && items[Math.floor(Math.random()*items.length)]

class MessagePrinter {
  constructor() {
    this._answers = data
    this.print = this.print.bind(this)
  }
  async print(ctx, obj) {
    let user = ctx.session.user
    if (ctx.event.isText) {
      await ctx.sendText(pickRan(this._answers[obj.type]))
    }
  }
}

module.exports = MessagePrinter
