/* eslint-disable global-require */
// eslint-disable-next-line func-names
exports.seed = async function (knex) {
  const { Model } = require('objection');
  Model.knex(knex);
  const Person = require('../../models/Person');

  const epochTimestamp = Math.floor((new Date()).getTime() / 1000);

  const personValues = [
    {
      id: 1,
      firstName: 'Ann',
      middleName: '',
      lastName: 'Abbott',
      phone: '5121112222',
      email: 'ann@dot.com',
      updateUser: 'john.d.lednicky',
      updateDttm: epochTimestamp,
    },
    {
      id: 2,
      firstName: 'Bob',
      middleName: '',
      lastName: 'Boebert',
      phone: '5122223333',
      email: 'bob@dot.com',
      updateUser: 'john.d.lednicky',
      updateDttm: epochTimestamp,
    },
    {
      id: 3,
      firstName: 'Carol',
      middleName: '',
      lastName: 'Cruz',
      phone: '5124445555',
      email: 'carol@dot.com',
      updateUser: 'john.d.lednicky',
      updateDttm: epochTimestamp,
    },
    {
      id: 4,
      firstName: 'Dan',
      middleName: '',
      lastName: 'Dinkle',
      phone: '5126667777',
      email: 'dan@dot.com',
      updateUser: 'john.d.lednicky',
      updateDttm: epochTimestamp,
    },
    {
      id: 5,
      firstName: 'Erin',
      middleName: '',
      lastName: 'Emmerlin',
      phone: '5127778888',
      email: 'erin@dot.com',
      updateUser: 'john.d.lednicky',
      updateDttm: epochTimestamp,
    },
    {
      id: 6,
      firstName: 'Federico',
      middleName: '',
      lastName: 'Fuentes',
      phone: '5127778888',
      email: 'federico@dot.com',
      updateUser: 'john.d.lednicky',
      updateDttm: epochTimestamp,
    },
  ];

  await Person.query().insertGraph(personValues);

  return Promise.resolve();
};
