/* eslint no-octal: 0 */  // --> OFF
exports.seed = async function (knex) {
    const Model = require('objection').Model;
    Model.knex(knex);
    const Event = require('../../models/Event');

    const {addDays,subDays,isBefore,isWeekend,format,set} = require('date-fns');
    const today = new Date();
    today.setHours(0,0,0,0);
    let currentDate = subDays(today, 60);
    const lastDate = addDays(today, 60);
    let eventValues = [];

    while(isBefore(subDays(currentDate,1),lastDate)) {
        if (!isWeekend(currentDate)) {
            eventValues.push(
                {
                    eventTypeId: 1,
                    beginDttm: format(set(currentDate, {hours: 8, minutes: 15}), 'yyyy-MM-dd HH:mm:ss.SS'),
                    endDttm: format(set(currentDate, {hours: 11, minutes: 0}), 'yyyy-MM-dd HH:mm:ss.SS'),
                    peopleNeeded: 3, 
                    comment: '',
                    updateUser: 'john.d.lednicky',
                    updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS')                   
                },
                {
                    eventTypeId: 2,
                    beginDttm: format(set(currentDate, {hours: 11, minutes: 0}), 'yyyy-MM-dd HH:mm:ss.SS'),
                    endDttm: format(set(currentDate, {hours: 13, minutes: 30}), 'yyyy-MM-dd HH:mm:ss.SS'),
                    peopleNeeded: 3, 
                    comment: '',
                    updateUser: 'john.d.lednicky',
                    updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS')                   
                },
                {
                    eventTypeId: 3,
                    beginDttm: format(set(currentDate, {hours: 8, minutes: 15}), 'yyyy-MM-dd HH:mm:ss.SS'),
                    endDttm: format(set(currentDate, {hours: 11, minutes: 0}), 'yyyy-MM-dd HH:mm:ss.SS'),
                    peopleNeeded: 1, 
                    comment: '',
                    updateUser: 'john.d.lednicky',
                    updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS')                   
                },
                {
                    eventTypeId: 4,
                    beginDttm: format(set(currentDate, {hours: 11, minutes: 0}), 'yyyy-MM-dd HH:mm:ss.SS'),
                    endDttm: format(set(currentDate, {hours: 13, minutes: 30}), 'yyyy-MM-dd HH:mm:ss.SS'),
                    peopleNeeded: 1, 
                    comment: '',
                    updateUser: 'john.d.lednicky',
                    updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS')                   
                }          
            );
        }
        currentDate = addDays(currentDate, 1);
    }  
    await Event.query().insertGraph(eventValues);

    return Promise.resolve();
};