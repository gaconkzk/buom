const Context = require('bottender/lib/context/Context').default

// class SkypeContext extends Context {
class SkypeContext {
  constructor({
    client,
    event,
    session,
    initialState
  }) {
    // super({ event, session, initialState })
    this._client = client
  }

  get platform() {
    return 'skype'
  }

  async sendActivity(msg) {
    return await this._client.sendActivity(msg)
  }

  sendText(text) {
    return this._client.sendActivity(text)
  }
}

module.exports = SkypeContext
