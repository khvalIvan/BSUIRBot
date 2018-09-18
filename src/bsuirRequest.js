const request = require('request');
const querystring = require('querystring');
const cardHelper = require('./cardHelper');

function filterSchedules(schedules, options) {
    if (!options.a) {
        schedules = filterByWeek(schedules, options.c);
    }
    if (options.s) {
        schedules = filterBySubGroup(schedules, options.s);
    }
    return schedules;
}

function filterByWeek(schedules, currentWeekNumber) {
    schedules = schedules.filter(element => 
        element.schedule.some(subElement => isLessonInCurrentWeek(subElement, currentWeekNumber))
    ).map(element => {
        element.schedule = element.schedule.filter(subElement => isLessonInCurrentWeek(subElement, currentWeekNumber));
        return element;
    });
    return schedules;
}

function filterBySubGroup(schedules, currentSubGroup) {
    schedules = schedules.filter(element => 
        element.schedule.some(subElement => isLessonInCurrentSubGroup(subElement, currentSubGroup))
    ).map(element => {
        element.schedule = element.schedule.filter(subElement => isLessonInCurrentSubGroup(subElement, currentSubGroup));
        return element;
    });
    return schedules;
}

function isLessonInCurrentWeek(lesson, currentWeekNumber) {
    return lesson.weekNumber.includes(currentWeekNumber) || lesson.weekNumber.length === 0;
}

function isLessonInCurrentSubGroup(lesson, currentSubGroup) {
    return lesson.numSubgroup === currentSubGroup || lesson.numSubgroup === 0
}

async function getBSUIRSchedule(options) {
    const endpoint = 'https://students.bsuir.by/api/v1/studentGroup/schedule';
    
    const queryParams = {
      studentGroup: options.g
    };
  
    const scheduleRequest = `${endpoint}?${querystring.stringify(queryParams)}`;
  
    return new Promise((resolve) => {
      request(scheduleRequest, (err, response, body) => {
        if (err) {
          console.log(err);
        } else {
            let requestResult = 'Schedule is not available';
            if (body) {
                const data = JSON.parse(body);
                requestResult = cardHelper.getAdaptiveCardHeader();
                options.c = data.currentWeekNumber;
                if (data.examSchedules.length > 0) {
                    let examSchedules = filterSchedules(data.examSchedules, options);
                    requestResult = cardHelper.getAdaptiveCardContent(requestResult, examSchedules, 'Сессия', options.c);
                }
                if (data.schedules.length > 0) {
                    let lessonSchedules = filterSchedules(data.schedules, options);
                    requestResult = cardHelper.getAdaptiveCardContent(requestResult, lessonSchedules, 'Занятия', options.c);
                }
            }
            resolve(requestResult)
        }
      });
    });
}

module.exports = getBSUIRSchedule;