const Wit = require('node-wit').Wit

// choose best entity in order
const trained = ['drink', 'find', 'conversation', 'swear', 'change', 'massage']

class WitAiMatcher {
  constructor(config, botname) {
    this._client = new Wit({
      accessToken: config.serverAccessToken
    })

    this._botname = botname
    this._me = config.me

    this.match = this.match.bind(this)
  }

  _fixMe(text) {
    let coolText = text.repeat(1)
    if (this._me && this._me.length) {
      this._me.forEach(m => {
        coolText = coolText.replace(m, this._botname)
      })
    }

    return coolText
  }

  async match(msg) {
    let text = this._fixMe(msg.text)
    let response = await this._client.message(text, {})
    let intent
    if (response && response.entities) {
      let entities = response.entities
      intent = trained.map(t => entities[t])
        .filter(t => !!t)
        .map(t => {
          let maxconf = t.reduce((m, f) => (f.confidence < m.confidence) ? f : m, t[0])
          return {
            type: maxconf.value,
            confidence: maxconf.confidence,
            _rawEntities: response.entities
          }
        })
        .find(i => i.confidence >= 0.7)
    }

    return intent
  }
}

module.exports = WitAiMatcher
