const bsuirRequest = require('./bsuirRequest');

function createBotLogic() {
    return async (context) => {
        if (context.activity.type === 'conversationUpdate' && context.activity.membersAdded[0].name === 'Bot') {
            await context.sendActivity(`Hi! I'm a simple BSUIR schedule bot. If you want to see the current schedule for specific BSUIR group just type 'BSUIR BOT: <group number>'`);
        } else if (context.activity.type === 'message') {
            let messageText = context.activity.text.trim();
            if (messageText.startsWith('BSUIR BOT: ')) {
                let groupNumber = messageText.split('BSUIR BOT: ')[1];
                const currentSchedule = await bsuirRequest(groupNumber);
                context.sendActivity({ attachments: [currentSchedule] });
            }
        }
    }
}

module.exports = createBotLogic;