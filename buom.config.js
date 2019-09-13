require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3978,
  skype: {
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD,
    apiPostfix: process.env.SLACK_API_URL_POSTFIX || '/api/messages',
  },
  slack: {
    accessToken: process.env.SLACK_BOT_USER_AUTH_TOKEN,
    verificationToken: process.env.SLACK_VERIFICATION_TOKEN,
    apiPostfix: process.env.SLACK_API_URL_POSTFIX || '/api/messages',
  }
}
