class MessageProcessor {
  constructor(config, printer) {
    this._config = config
    this._matchers = []
    this._printer = printer

    this.addMatcher(helloMatcher)

    this.run = this.run.bind(this)
  }

  get matchers() {
    return this._matchers
  }

  addMatcher(matcher) {
    matcher.option = this._config[matcher.name]
    this.matchers.push(matcher)
  }

  async run(ctx) {
    let i
    for (i = 0; i < this.matchers.length; i++) {
      let matcher = this.matchers[i]
      let intent = await matcher(ctx.event)
      if (intent) {
        // console.log(JSON.stringify(intent, null, 2))
        this._printer.print(ctx, intent)
        break
      }
    }

    if (i == this.matchers.length) {
      this._printer.print(ctx, {
        type: 'unknown'
      })
    }
  }
}

const helloMatcher = (event) => {
  let msg = event.text || event.message
  if (msg === 'hi' || msg === 'hello') {
    return {
      type: 'conversation.greeting'
    }
  }
}

module.exports = MessageProcessor
