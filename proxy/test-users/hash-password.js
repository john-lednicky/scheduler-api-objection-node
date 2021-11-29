/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const argv = require('minimist')(process.argv.slice(2));

const saltRounds = 10;

const pw = argv._[0];

if (!pw) {
  console.log('Error: Please include the password to be hashed as the only unnamed argument.');
} else {
  bcrypt.hash(pw, saltRounds)
    .then((data) => {
      console.log(data);
      const insertSql = `insert into password (email, hash, username, user_id) values ("${pw}@dot.com","${data}", "${pw}", 0);`; console.log(insertSql);
    })
    .catch((err) => {
      console.log(err);
    });
}
