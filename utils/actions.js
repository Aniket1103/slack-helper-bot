const axios = require('axios');

const ACTIONS = {
  "hello": async (message, say) => {
    await say(`Hello there! <@${message.user}>.`);
  },
  "help": async (message, say) => {
    await say('Available commands:\n- /hello\n- /help\n- /time\n- /quote');
  },
  "time": async (message, say) => {
    const now = new Date();
    await say(`Current date and time: ${now.toISOString()}`);
  },
  "quote": async (message, say) => {
    let resp = await axios.get(`https://api.quotable.io/random`);
    const quote = resp.data.content;
    await say(`Here goes your quote <@${message.user}>,\n${quote}`);
  },
  "joke": async (message, say) => {
    let resp = await axios.get(`https://v2.jokeapi.dev/joke/Any?type=single`);
    const joke = resp.data.joke;
    // console.log(resp.data);
    await say(`Here goes your joke <@${message.user}>,\n${joke}`);
  }
}

const COMMANDS = Object.keys(ACTIONS);

module.exports = {
  ACTIONS,
  COMMANDS,
};