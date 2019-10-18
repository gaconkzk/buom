const Wit = require('node-wit').Wit

// choose best entity in order
const trained = ['drink', 'find', 'conversation', 'swear', 'change', 'massage']

class WitAiMatcher {
  constructor(config) {
    this._client = new Wit({
      accessToken: config.serverAccessToken
    })

    this.match = this.match.bind(this)
  }

  async match(msg) {
    let response = await this._client.message(msg.text, {})
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
