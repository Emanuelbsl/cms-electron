const ActiveDirectory = require('activedirectory')

const config = {
  url: import.meta.env.MAIN_AD_URL,
  baseDN: import.meta.env.MAIN_DOMAIN_CONTROLLER,
  username: import.meta.env.MAIN_AD_USERNAME,
  password: import.meta.env.MAIN_AD_PASSWORD,
}

export const ad = new ActiveDirectory(config)
