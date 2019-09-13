const Context = require('bottender/lib/context/Context').default

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
  }

  get platform() {
    return 'skype'
  }

  async sendActivity(msg) {
    return await this._client.sendActivity(msg)
  }

  sendText(text) {
    console.log(this._event.text)
    return this._client.sendActivity(text)
  }

  static make(ctx, event) {
    return new SkypeContext({ client: ctx, event })
  }
}

module.exports = SkypeContext
