require('dotenv').config()

module.exports = {
  name: 'buom',
  port: process.env.PORT || 3978,
  // bottener supported platforms
  platforms: process.env.PLATFORMS || 'console',
  useConsole: !process.env.PLATFORMS || false,
  skype: {
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD,
    apiPostfix: process.env.SKYPE_API_URL_POSTFIX || '/api/messages',
  },
  slack: {
    accessToken: process.env.SLACK_BOT_USER_AUTH_TOKEN,
    verificationToken: process.env.SLACK_VERIFICATION_TOKEN,
    apiPostfix: process.env.SLACK_API_URL_POSTFIX || '/api/messages'
  },
  matchers: {
    witai: {
      type: "WitAiMatcher",
      appId: process.env.WIT_APP_ID,
      serverAccessToken: process.env.WIT_SERVER_ACCESS_TOKEN,
      me: [
        process.env.SLACK_ME_TEXT
      ]
    }
  },
  processor: {
    handler: {
      intents: [
        {
          name: "find.image",
          handle: "GoogleSearchHandler",
          envs: {
            baseURL: "https://www.googleapis.com/customsearch/v1",
            apiKey: process.env.GOOGLE_API_KEY,
            searchEngineId: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID
          }
        },
        {
          name: "drink.location",
          handle: "FoodySearchHandler",
          envs: {
            baseURL: "https://www.foody.vn/__get/AutoComplete/Keywords"
          }
        }
      ],
      printer: {}
    }
  }
}
