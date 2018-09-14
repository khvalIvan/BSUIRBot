const request = require('request');
const querystring = require('querystring');
const cardHelper = require('./cardHelper');

async function getBSUIRSchedule(groupNumber) {
    const endpoint = 'https://students.bsuir.by/api/v1/studentGroup/schedule';
    
    const queryParams = {
      studentGroup: groupNumber
    };
  
    const scheduleRequest = `${endpoint}?${querystring.stringify(queryParams)}`;
  
    return new Promise((resolve) => {
      request(scheduleRequest, (err, response, body) => {
        if (err) {
          console.log(err);
        } else {
            if (body) {
                const data = JSON.parse(body);
                let adaptiveCard = cardHelper.getAdaptiveCardHeader();
                if (data.examSchedules.length > 0) {
                    adaptiveCard = cardHelper.getAdaptiveCardContent(adaptiveCard, data.examSchedules, 'Сессия', data.currentWeekNumber);

                }
                if (data.schedules.length > 0) {
                    adaptiveCard = cardHelper.getAdaptiveCardContent(adaptiveCard, data.schedules, 'Занятия', data.currentWeekNumber);
                }
                resolve(adaptiveCard);
            }
        }
      });
    });
}

module.exports = getBSUIRSchedule;