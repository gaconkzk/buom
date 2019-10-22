const Context = require('bottender/dist/context/Context').default
const { MessageFactory, CardFactory } = require('botbuilder')
/**
 * In Skype, we need to use `  \n` for line break
 * @param {String} str
 */
function fixLineBreak(msg) {
  if (typeof msg === 'string') {
    return msg.replace(/\n/g, '  \n')
  } else if (msg.text) {
    msg.text = msg.text.replace(/\n/g, '  \n')
    return msg
  }

  return msg
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

    let text = msg.text.replace(`<@${user.id}>`, `<at>${user.name}</at>`)

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

    return Object.assign(msg, jsonMsg)
  }

  get platform() {
    return 'skype'
  }

  makeImgMsg(img) {
    return Object.assign(CardFactory.heroCard(
      img.name || '',
      img.address || img.link,
      CardFactory.images([img.url]),
      []
    ), img)
  }

  static make(ctx, event) {
    let session = {
      user: event._rawEvent.from
    }

    return new SkypeContext({ client: ctx, event, session })
  }
}

module.exports = SkypeContext
