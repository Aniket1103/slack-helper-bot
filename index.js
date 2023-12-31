require('dotenv').config();

const { App } = require('@slack/bolt');
const { COMMANDS, ACTIONS } = require('./utils/actions');
const { FileInstallationStore, InstallProvider } = require('@slack/oauth');

const signingSecret = process.env['SLACK_SIGNING_SECRET'];
const botToken = process.env['SLACK_BOT_TOKEN'];
const clientId = process.env['SLACK_CLIENT_ID'];
const clientSecret = process.env['SLACK_CLIENT_SECRET'];


const app = new App({
  signingSecret,
  clientId,
  clientSecret,
  stateSecret: 'my-state-secret',
  scopes: ['channels:history', 'chat:write', 'commands'],
  // installationStore: new FileInstallationStore(),
});

// const app = new App({
//   signingSecret: signingSecret,
//   token: botToken,
// });

// const installer = new InstallProvider({
//   clientId: process.env.SLACK_CLIENT_ID,
//   clientSecret: process.env.SLACK_CLIENT_SECRET,
//   stateSecret: 'my-state-secret'
// });



// app.action('button_click', async ({ body, ack, say }) => {
//   await ack();
//   await say(`<@${body.user.id}> clicked the button`);
// });

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
