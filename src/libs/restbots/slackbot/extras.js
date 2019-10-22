const pascalCase = require('pascal-case')

const { SlackEvent, SlackContext } = require('bottender')

// grouping special events with common ones
const groups = [
  {
    message: ['app_mention'],
  }
]

groups.forEach(o => {
  Object.keys(o).forEach(prop => {
    // app_mention is same as message
    Object.defineProperty(SlackEvent.prototype, `is${pascalCase(prop)}`, {
      enumerable: false,
      configurable: true,
      get() {
        return this._rawEvent.type === prop || o[prop].indexOf(this._rawEvent.type) >= 0;
      }
    })
  })
})

SlackContext.prototype.makeImgMsg = (img) => {
  return Object.assign(img, {
    fallback: img.name || '',
    pretext: img.address || img.link,
    title: img.name,
    title_link: img.link,
    image_url: img.url
  })
}
