require('dotenv').config();
const APP_ID = process.env.DISCORD_APP_ID;
const TOKEN = process.env.DISCORD_TOKEN;

module.exports = {
  APP_ID,
  TOKEN,
};
