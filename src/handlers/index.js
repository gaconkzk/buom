const handler = async ctx => {
  // should cover: `message`, `app_mention` events in slack
  // and `message` event in skype
  let user = ctx.session.user
  if (ctx.event.isText) {
    await ctx.sendText(`Hello world. Platform: ${ctx.platform}
<@${user.id}> sent: ${ctx.event.text}`, { user })
  }
}

module.exports = handler
