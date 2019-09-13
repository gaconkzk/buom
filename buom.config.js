require('dotenv').config()

module.exports = {
  skype: {
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
  },
  slack: {
    accessToken: process.env.SLACK_BOT_USER_AUTH_TOKEN,
    verificationToken: process.env.SLACK_VERIFICATION_TOKEN,
    apiPostfix: process.env.SLACK_API_URL_POSTFIX || '/api/messages',
  }
}
