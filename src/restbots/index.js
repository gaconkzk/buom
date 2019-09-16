const express = require('express')
const bodyParser = require('body-parser')

const { initializeBots } = require('./restbots')

function start(handler, config) {
  const server = express()
  server.use(
    bodyParser.json({
      verify: (req, res, buf) => {
        req.rawBody = buf.toString()
      }
    })
  )

  initializeBots(server, handler, config)

  server.listen(config.port || 3978, () => {
    console.log('server is listening')
  })
}

module.exports = {
  start
}
