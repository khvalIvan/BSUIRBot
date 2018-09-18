const bsuirRequest = require('./bsuirRequest');
const minimist = require('minimist');
const {MessageFactory, ActionTypes, CardAction, CardFactory} = require('botbuilder');

const minimistArgs = {
    alias: { 
        i: 'init',
        d: 'default',
        g: 'group',
        s: 'subgroup',
        a: 'all',
        h: 'help'
    }
}

function createBotLogic(convoState) {
    return async (context) => {
        if (context.activity.type === 'conversationUpdate' && context.activity.membersAdded[0].name === 'Bot') {
            const suggestedActions = [
                {
                    type: ActionTypes.PostBack,
                    title: 'Help',
                    value: '@BOT --HELP'
                }
            ];
            const basicMessage = MessageFactory.suggestedActions(suggestedActions, `Hi! I'm a BSUIR schedule bot. If you want to see the list of available keys just type '@BOT --HELP' or click the button`);
            await context.sendActivity(basicMessage);
        } else if (context.activity.type === 'message' && context.activity.recipient.name === 'Bot') {
            let messageText = context.activity.text.trim().toLowerCase();
            let defaultValues = await convoState.storage.read(['command']);
            let command = minimist(messageText.split(' '), minimistArgs);
            if (command.h) {
                await context.sendActivity("@BOT <keys> - show schedule\n" +
                "Keys:\n-i, --init - init default values\n-d, --default - show default values\n" +
                "-g, --group number - group \n-a, --all - show full schedule (otherwise only for this week)\n" +
                "-s, --subgroup number - show schedule for specified subgroup\n-h, --help - show help\n" +
                "Any other text - show week schedule for default group and subgroup\n" + 
                "Please note: you need to write @BOT only in group dialogs");
            } else if (command.i) {
                defaultValues['command'] = {
                    g: command.g,
                    s: command.s,
                    eTag: "*" 
                }
                convoState.storage.write(defaultValues)
                await context.sendActivity(`Default values set:\nGroup: ${command.g}\nSubgroup: ${command.s}`)
            } else if (command.d) {
                await context.sendActivity(`Default values:\nGroup: ${defaultValues.command.g}\nSubgroup: ${defaultValues.command.s}`)
            } else {
                command = Object.assign(defaultValues.command, command);
                const requestResult = await bsuirRequest(command);
                switch (typeof requestResult) {
                    case 'object':
                        let text = `Group: ${command.g}\nSubgroup: ${typeof command.s !== "undefined" ? command.s : ""}`
                        await context.sendActivity({text: text, attachments: [requestResult] });
                        break;
                    case 'string':
                        await context.sendActivity(requestResult);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

module.exports = createBotLogic;