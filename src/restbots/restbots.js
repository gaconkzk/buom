const { SlackBot } = require('bottender')
const { registerRoutes } = require('@bottender/express')
const { SkypeBot, registerSkypeRoutes } = require('./skypebot')

require('./extras')

function _createBot(platform, config) {
  switch (platform) {
    case 'slack':
      return new SlackBot(config)
    case 'skype':
      return new SkypeBot(config)
  }
}

const makeBot = (conf) => conf.platforms.split(',').map(p => _createBot(p, conf[p]))

function addRoutes(server, bot, route, handler) {
  if (bot.connector.platform === 'skype') {
    registerSkypeRoutes(server, bot, route, handler.run)
  } else {
    bot.onEvent(handler.run)
    registerRoutes(server, bot, route)
  }
}

function initializeBots(server, handler, config) {
  const bots = makeBot(config)
  bots.filter(b => !!b).forEach(b => {
    addRoutes(server, b, { path: `/${b.connector.platform}${config[b.connector.platform].apiPostfix}`}, handler)
    console.log(`Registered new ${b.connector.platform} bot on path: /${b.connector.platform}${config[b.connector.platform].apiPostfix}`)
  })
}

module.exports = {
  initializeBots
}
