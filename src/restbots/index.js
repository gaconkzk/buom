const makeBot = (conf) => conf.platforms.split(',').map(p => createBot(p, conf[p]))

function createBot(platform, config) {
  switch (platform) {
    case 'slack':
      const { SlackBot } = require('bottender')
      return new SlackBot(config)
  }
}

const express = require('express')
const bodyParser = require('body-parser')
const { registerRoutes } = require('@bottender/express')

function start(handler, config) {
  const server = express()
  server.use(
    bodyParser.json({
      verify: (req, res, buf) => {
        req.rawBody = buf.toString()
      }
    })
  )

  const bots = makeBot(config)
  // share handler for all bot
  bots.filter(b => !!b).forEach(b => {
    b.onEvent(handler)
    registerRoutes(server, b, { path: `/${b.connector.platform}${config.slack.apiPostfix}`})
    console.log(`Registered new ${b.connector.platform} bot on path: /${b.connector.platform}${config.slack.apiPostfix}`)
  })

  var skypeEnabled = config.useSkype || false
  if (skypeEnabled) {
    require('../skypebot')
      .createSkypeBot(server, handler, config.skype)
    console.log(`Registered new skype bot on path: /skype${config.skype.apiPostfix}`)
  }

  server.listen(config.port || 3978, () => {
    console.log('server is listening')
  })
}

module.exports = {
  start
}
