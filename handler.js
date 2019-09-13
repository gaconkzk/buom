const handler = async ctx => {
  await ctx.sendText(`Hello world. Platform: ${ctx.platform}`)
}

module.exports = handler
