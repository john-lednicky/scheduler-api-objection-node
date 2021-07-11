exports.seed = async function (knex, promise) {

    const { Model, knexIdentifierMapping } = require(`objection`);

    Model.knex(knex);

    const Event = require(`../../models/Event`);
    const EventType = require(`../../models/EventType`);
    const Person = require(`../../models/Person`);
    const Assignment = require(`../../models/Assignment`);

    const expectedEventCount = 344;
    const expectedEventTypeCount = 4;
    const expectedPersonCount = 6;
    const expectedAssignmentCount = 412;

    const eventCount = await Event.query().count();
    const eventTypeCount = await EventType.query().count();
    const personCount = await Person.query().count();
    const assignmentCount = await Assignment.query().count();

    const eventCountInt = eventCount[0]["count(*)"];
    const eventTypeCountInt = eventTypeCount[0]["count(*)"];
    const personCountInt = personCount[0]["count(*)"];
    const assignmentCountInt = assignmentCount[0]["count(*)"];

    let errorMessage = '';

    if (eventTypeCountInt != expectedEventTypeCount) {
        errorMessage = errorMessage + `event_type table has ${expectedEventTypeCount} records, but should have ${eventTypeCountInt} records. `;
    }
    if (expectedPersonCount != personCountInt) {
        errorMessage = errorMessage + `person table has ${personCountInt} records, but should have ${expectedPersonCount} records. `;
    }
    if (expectedAssignmentCount > 450 || expectedAssignmentCount < 350) {
        errorMessage = errorMessage + `assignment table has ${assignmentCountInt} records, but should have around 400 records.`;
    }
    if (expectedEventCount > 375 || eventCountInt < 325) {
        errorMessage = errorMessage + `event table has ${eventCountInt} records, but should have around 340 records. `;
    }    
    if (expectedAssignmentCount != assignmentCountInt) {
        //errorMessage = errorMessage + `assignment table has ${assignmentCountInt} records, but should have ${expectedAssignmentCount} records.`;
    }
    if (expectedEventCount != eventCountInt) {
        //errorMessage = errorMessage + `event table has ${eventCountInt} records, but should have ${expectedEventCount} records. `;
    }

    if (errorMessage.length > 0) {
        throw new Error(errorMessage);
    }
};
