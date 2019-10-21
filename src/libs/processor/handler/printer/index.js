const data = require('./default-data.json')

const pickRan = (items) => items && items[Math.floor(Math.random()*items.length)]

const format = (...params) => {
  if (params.length < 2) {
    return params[0]
  }
  let fstr = String(params[0])
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

function makeImgMsg(img) {
  return img.url
}

class MessagePrinter {
  constructor() {
    this._answers = data
    this.print = async (ctx, msg) => {
      let obj = ctx.intent
      let user = ctx.session.user
      let answer = msg || format(pickRan(this._answers[obj.type]), user ? `<@${user.id}>` : user)
      if (ctx.event.isText) {
        await ctx.sendText(answer)
      }
    }

    this.printImgs = async (ctx, imgs) => {
      let imgMsgs = imgs.map(makeImgMsg)
      imgMsgs.forEach(async i => {
        await ctx.sendText(i)
      })
    }
  }
}

module.exports = MessagePrinter
