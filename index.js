require('dotenv').config();

const axios = require('axios');
const { App } = require('@slack/bolt');
const signingSecret = process.env['SLACK_SIGNING_SECRET']
const botToken = process.env['SLACK_BOT_TOKEN']

const ACTIONS = {
  "hello" : async (message, say) => {
    await say(`Hello there! <@${message.user}>.`);
  },
  "help" : async (message, say) => {
    await say('Available commands:\n- /hello\n- /help\n- /time\n- /quote');
  },
  "time" : async (message, say) => {
    const now = new Date();
    await say(`Current date and time: ${now.toISOString()}`);
  },
  "quote" : async (message, say) => {
    let resp = await axios.get(`https://api.quotable.io/random`);
    const quote = resp.data.content;
    await say(`Here goes your quote <@${message.user}>,\n${quote}`);
  },
}

const COMMANDS = Object.keys(ACTIONS);

const app = new App({
  signingSecret: signingSecret,
  token: botToken,
});



app.error(console.error);

app.message(async ({ message, say }) => {
  let currentCommand = message.text.toLowerCase();
  if (COMMANDS.includes(currentCommand)) {
    await ACTIONS[message.text.toLowerCase()](message, say);
  } 
  else {
    await say("I'm sorry, I don't understand that command. Type 'help' to see available commands.");
  }
});

app.event('app_home_opened', async ({ event, say }) => {
  console.log(event);
  await say(`Hello, <@${event.user}>, welcome again\nHow can I help you.`);
});

// Commands Definition

// app.command('/hello', async ({ command, ack, say }) => {
//   await ack();
//   await say('Hello there!');
// });

(async () => {
  await app.start(process.env.PORT || 3000);
 
  console.log(`Bolt app is running!`);
})();
