exports.seed = async function (knex) {

    const {format} = require('date-fns');

    const Model = require('objection').Model;
    Model.knex(knex);
    const Person = require('../../models/Person');

    var personValues =
        [
            {
                id: 1,
                firstName: 'Ann',
                middleName: '',
                lastName: 'Abbott',
                phone: '5121112222',
                email: 'ann.abbott@scratch.com',
                updateUser: 'john.d.lednicky',
                updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS')   
            },
            {
                id: 2,
                firstName: 'Bob',
                middleName: '',
                lastName: 'Boebert',
                phone: '5122223333',
                email: 'bob.boebert@scratch.com',
                updateUser: 'john.d.lednicky',
                updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS')   
            },
            {
                id: 3,
                firstName: 'Carol',
                middleName: '',
                lastName: 'Cruz',
                phone: '5124445555',
                email: 'carol.cruz@scratch.com',
                updateUser: 'john.d.lednicky',
                updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS')   
            },
            {
                id: 4,
                firstName: 'Dan',
                middleName: '',
                lastName: 'Dinkle',
                phone: '5126667777',
                email: 'donald.drumpf@scratch.com',
                updateUser: 'john.d.lednicky',
                updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS')   
            },
            {
                id: 5,
                firstName: 'Erin',
                middleName: '',
                lastName: 'Emmerlin',
                phone: '5127778888',
                email: 'erin.emmerlin@scratch.com',
                updateUser: 'john.d.lednicky',
                updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS')   
            },
            {
                id: 6,
                firstName: 'Federico',
                middleName: '',
                lastName: 'Fuentes',
                phone: '5127778888',
                email: 'federico.fuentes@scratch.com',
                updateUser: 'john.d.lednicky',
                updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS')   
            }
        ];

    await Person.query().insertGraph(personValues);

    return Promise.resolve();
};