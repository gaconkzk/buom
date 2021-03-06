const axios = require('axios')

const { getRandomArrayElements } = require('./Utils')

class GoogleSearchHandler {
  constructor(envs, printer) {
    this._googleApis = {
      cx: envs.searchEngineId,
      key: envs.apiKey,
      searchType: 'image',
      fields: 'items(link, mime)'
    }

    this._api = axios.create({ baseURL: envs.baseURL })

    this._printer = printer

    this.go = async (ctx) => {
      let entities = ctx.intent._rawEntities

      let query = this._getQuery(entities.query || [])

      if (!query) {
        ctx.intent = { type: 'unknown' }
        await this._printer.print(ctx, { text: 'tìm hình gì dzậy anh?' })

        return
      }

      this._printer.print(ctx, { text: `chờ em xí, đang kiếm hình \`${query}\` nha {}`})
      let quatities = this._getQuatities(entities.number || [])
      let logic = this._getLogic(entities.logic || [])

      await this._findImage(ctx, query, quatities, logic)
    }
  }

  _getQuery(query) {

    return query
      .filter( q => q.confidence>0.5 )
      .map( q => q.value)
      .join(' ')
  }

  _getQuatities(number) {

    return number
      .filter( q => q.confidence>0.8 )
      .map( q => parseInt(q.value))
      .reduce((max, f) => ((f < max) ? max : f), 0)
  }

  _getLogic(data) {
    let logic = data
      .find( q => q.confidence>0.8 )

    return logic ? logic.value : 'random'
  }

  _takeByLogic(logic, quatities, images) {
    let number = quatities || 1
    let imgs
    switch (logic) {
      case 'first':
        imgs = images.slice(0, number)
        break

      case 'last':
        imgs = images.slice(Math.max(images.length - number, 1))
        break

      case 'random':
      default:
        imgs = getRandomArrayElements(images, number)
        break
    }

    return imgs
  }

  async _findImage(ctx, query, quatities, logic) {
    let params = {
      params: Object.assign({ q: query }, this._googleApis)
    }

    let response = await this._api.get('', params)
    if (response) {
      let images = this._takeByLogic(logic, quatities, response.data.items || [])
      if (!images || !images.length) {
        await this._printer.print(ctx, { text: 'hong có hình là hong có hình!!!' })

        return
      }

      await this._printer.printImgs(ctx, images.map(i => ({ url: i.link, mime: i.mime, link: i.link })), 'hình về hình về')
    } else {
      await this._printer.print(ctx, { text: 'hong có hình là hong có hình!!!' })
    }
  }
}

module.exports = GoogleSearchHandler
