class SkypeEvent {
  constructor(rawEvent) {
    this._rawEvent = rawEvent
  }

  get rawEvent() {
    return this._rawEvent
  }

  get isText() {
    return this.isMessage
  }

  get isMessage() {
    return !!(this._rawEvent.text && this._rawEvent.type === 'message')
  }

  get isMention() {
    return true
  }

  get message() {
    return this.text
  }

  get text() {
    if (this.isText) {
      return this._rawEvent.text
    }
    return null
  }

  static make(ctx) {
    return new SkypeEvent(ctx)
  }
}

module.exports = SkypeEvent
