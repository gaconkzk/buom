const express = require('express')
const bodyParser = require('body-parser')

const { SlackBot } = require('bottender')

const { registerRoutes } = require('@bottender/express')

const { createSkypeBot } = require('./skypebot')

require('./extras')

const makeBot = (conf) => conf.platforms.split(',').map(p => createBot(p, conf[p]))

function createBot(platform, config) {
  switch (platform) {
    case 'slack':
      return new SlackBot(config)
  }
}

function start(handler, config) {
  const server = express()
  server.use(
    bodyParser.json({
      verify: (req, res, buf) => {
        req.rawBody = buf.toString()
      }
    })
  )

  //=== intergate bots with server routes
  const bots = makeBot(config)
  // share handler for all bots
  bots.filter(b => !!b).forEach(b => {
    b.onEvent(handler)
    registerRoutes(server, b, { path: `/${b.connector.platform}${config.slack.apiPostfix}`})
    console.log(`Registered new ${b.connector.platform} bot on path: /${b.connector.platform}${config[b.connector.platform].apiPostfix}`)
  })

  // skype have different mechanism
  if (config.useSkype) {
    createSkypeBot(server, handler, config.skype)
    console.log(`Registered new skype bot on path: /skype${config.skype.apiPostfix}`)
  }
  //=== bots now in server routes

  server.listen(config.port || 3978, () => {
    console.log('server is listening')
  })
}

module.exports = {
  start
}
