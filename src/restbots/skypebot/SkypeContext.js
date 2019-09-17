const Context = require('bottender/lib/context/Context').default

/**
 * In Skype, we need to use `  \n` for line break
 * @param {String} str
 */
function fixLineBreak(str) {
  return str.replace(/\n/g, '  \n')
}

class SkypeContext extends Context {
  constructor({
    client,
    event,
    session,
    initialState
  }) {
    super({ event, session, initialState })
    this._client = client
    this._event = event
    this._session = session
  }

  /**
   * Since the format of slack is good, so it's the default - we gonna
   * transform the reply to correct format in eah context
   * FIXME - This not worked
   * @param {String} msg
   * @returns Skype Message with correct mention
   */
  _addMention(msg) {
    let user = this._session.user || {}
    if (!this.event.isMention) {
      return msg.replace(`<@${user.id}>`, `${user.name || 'You'}`)
    }

    let text = msg.replace(`<@${user.id}>`, `<at>${user.name}</at>`)
    let jsonMsg = {
      text,
      entities: [
        {
          type: 'mention',
          text: `<at>${user.name}</at>`,
          mentioned: {
            name: `${user.name}`,
            id: user.id
          }
        }
      ]
    }

    return jsonMsg
  }

  get platform() {
    return 'skype'
  }

  async sendActivity(msg) {
    return await this._client.sendActivity(msg)
  }

  sendText(text) {
    return this._client.sendActivity(
      this._addMention(
        fixLineBreak(text)
      )
    )
  }

  static make(ctx, event) {
    let session = {
      user: event._rawEvent.from
    }

    return new SkypeContext({ client: ctx, event, session })
  }
}

module.exports = SkypeContext
