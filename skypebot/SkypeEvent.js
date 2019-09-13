class SkypeEvent {
  constructor(rawEvent) {
    this._rawEvent = rawEvent
  }


  static make(ctx) {
    return new SkypeEvent(ctx)
  }
}

module.exports = SkypeEvent
