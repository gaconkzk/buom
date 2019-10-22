const axios = require('axios')

const { getRandomArrayElements } = require('./Utils')

class FoodySearchHandler {
  constructor(envs, printer) {
    this._api = axios.create({ baseURL: envs.baseURL })

    this._printer = printer

    this.go = async (ctx) => {
      let entities = ctx.intent._rawEntities

      let query = `Quán nhậu ${this._getQuery(entities.query || [])}`.trimRight()

      // this._printer.print(ctx, { text: `chờ em xí, đang kiếm hình \`${query}\` nha {}`})
      let quatities = this._getQuatities(entities.number || [])
      let logic = this._getLogic(entities.logic || [])

      await this._findDrinkLocation(ctx)
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

  async _findDrinkLocation(ctx, query, quatities, logic) {
    let params = {
      params: {
        provinceId: 217,
        term: 'Quán nhậu'
      }
    }

    let response = await this._api.get('', params)
    if (response) {
      let items = response.data
      let location = items.filter(i => i.category === "Quán nhậu")
        .map(i => ({
          name: i.name,
          url: i.img.replace('/s50/', '/s576x330/'),
          address: i.address,
          link: `https://www.foody.vn${i.link}`
        }))

      location = this._takeByLogic(logic, quatities, location || [])

      if (!location || !location.length) {
        await this._printer.print(ctx)
        return
      }

      await this._printer.printImgs(ctx, location, 'trên fút đi nói quán này nè')
    } else {
      await this._printer.print(ctx)
    }
  }
}

module.exports = FoodySearchHandler
