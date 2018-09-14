const { BotFrameworkAdapter, BotStateSet, MemoryStorage, ConversationState, UserState } = require('botbuilder');
const restify = require('restify');

const createBotLogic = require('./src/bot');

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const storage = new MemoryStorage();
const convoState = new ConversationState(storage);
const userState = new UserState(storage);
adapter.use(new BotStateSet(convoState, userState));

const botLogic = createBotLogic();

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, botLogic);
});