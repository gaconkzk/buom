const data = require('./default-data.json')

const pickRan = (items) => items && items[Math.floor(Math.random()*items.length)]

const format = (...params) => {
  console.log(params)
  if (params.length < 2) {
    return params[0]
  }
  let fstr = new String(params[0])
  for (let i = 1; i < params.length; i++) {
    let ssi = fstr.indexOf("{}")
    if (ssi >= 0) {
      fstr = fstr.substring(0, ssi) + params[i] + fstr.substring(ssi+2)
    } else {
      break
    }
  }

  return fstr
}

class MessagePrinter {
  constructor() {
    this._answers = data
    this.print = this.print.bind(this)
  }
  async print(ctx, obj) {
    let user = ctx.session.user
    if (ctx.event.isText) {
      await ctx.sendText(
        format(pickRan(this._answers[obj.type]), user ? `<@${user.id}>` : '')
      )
    }
  }
}

module.exports = MessagePrinter
