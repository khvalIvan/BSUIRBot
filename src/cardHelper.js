const { CardFactory } = require('botbuilder');

function getAdaptiveCardContent(adaptiveCard, schedules, type, currentWeekNumber) {
    adaptiveCard.content.body.push(getHeaderColumnSet({text: type, currentWeekNumber: currentWeekNumber}));
    for (const day of schedules) {
        adaptiveCard.content.body.push(getAdaptiveCardTextBlock({text: day.weekDay, weight: 'bolder', color: 'accent'}))
        for (const item of day.schedule) {
            adaptiveCard.content.body.push(getDayScheduleColumnSet(item))                            
        }
    }
    return adaptiveCard;
}

function getAdaptiveCardHeader() {
    scheduleSchema = {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.0',
            type: 'AdaptiveCard',
            body: []
        }
    }
    return scheduleSchema;
}

function getAdaptiveCardTextBlock(options) {
    let textBlock = {
        type: 'TextBlock',
        text: options.text,
        isSubtle: false,
        weight: options.weight || 'default',
        separator: true,
        color: options.color || 'default'
    }
    return textBlock;
}

function getAdaptiveCardColumn(options) {
    let column = {
        type: 'Column',
        width: options.width || 'auto',
        items: [],
        size: 'large',
        horizontalAlignment: options.horizontalAlignment || 'left'
    }
    column.items.push(getAdaptiveCardTextBlock({text: options.text, weight: options.weight, color: options.color }))
    return column
}

function getHeaderColumnSet(options) {
    let columnSet = {
        type: 'ColumnSet',
        columns: []
    }
    columnSet.columns.push(
        getAdaptiveCardColumn({text: options.text, weight: 'bolder', color: 'accent', width: 'stretch'})
    )
    columnSet.columns.push(
        getAdaptiveCardColumn({text: `Текущая неделя: ${options.currentWeekNumber}`, weight: 'bolder', color: 'accent', horizontalAlignment: 'right'})
    )
    return columnSet;
}

function getDayScheduleColumnSet(item) {
    let columnSet = {
        type: 'ColumnSet',
        columns: []
    }
    columnSet.columns.push(
        getAdaptiveCardColumn({text: item.lessonTime})
    )
    columnSet.columns.push(
        getAdaptiveCardColumn({text: `${item.subject} (${item.lessonType})`})
    )
    columnSet.columns.push(
        getAdaptiveCardColumn({text: item.note, width: 'stretch'})
    )
    if (item.weekNumber.length > 0 && item.weekNumber.length < 5) {
        columnSet.columns.push(
            getAdaptiveCardColumn({text: item.weekNumber.join(', ')})
        )
    }
    columnSet.columns.push(
        getAdaptiveCardColumn({text: item.auditory[0], horizontalAlignment: 'right'})
    )
    return columnSet;
}

module.exports = {
    getDayScheduleColumnSet: getDayScheduleColumnSet,
    getHeaderColumnSet: getHeaderColumnSet,
    getAdaptiveCardColumn: getAdaptiveCardColumn,
    getAdaptiveCardTextBlock: getAdaptiveCardTextBlock,
    getAdaptiveCardHeader: getAdaptiveCardHeader,
    getAdaptiveCardContent: getAdaptiveCardContent
}