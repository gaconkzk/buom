const Context = require('bottender/dist/context/Context').default

/**
 * In Skype, we need to use `  \n` for line break
 * @param {String} str
 */
function fixLineBreak(msg) {
  if (typeof msg === 'string') {
    return msg.replace(/\n/g, '  \n')
  } else {
    return msg.text.replace(/\n/g, '  \n')
  }
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

    this.sendActivity = (msg) => {
      this._client.sendActivity(msg)
        .catch(_ => {
          // FIXME: stupid err but i don't know how to fix, ignored
        })
    }

    this.sendText = async (msg) => {
      await this.sendActivity(
        this._addMention(
          fixLineBreak(msg)
        )
      )
    }
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

    let text = msg.text
    if (typeof msg === 'string') {
      text = msg.replace(`<@${user.id}>`, `<at>${user.name}</at>`)
    }

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

  static make(ctx, event) {
    let session = {
      user: event._rawEvent.from
    }

    return new SkypeContext({ client: ctx, event, session })
  }
}

module.exports = SkypeContext
