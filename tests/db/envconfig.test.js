console.log(process.env);
const result = require('dotenv').config()

if (result.error) {
  throw result.error
}

console.log(`process.env.MYSQL_DBNAME_FILE: ${process.env.MYSQL_DBNAME_FILE}`);
console.log(`process.env.MYSQL_USERNAME_FILE: ${process.env.MYSQL_USERNAME_FILE}`);
console.log(`process.env.MYSQL_PASSWORD_FILE: ${process.env.MYSQL_PASSWORD_FILE}`);
console.log(`process.env.MYSQL_HOST_FILE: ${process.env.MYSQL_HOST_FILE}`);

/* $env:TEST_VALUE="flibbertegibbet" */
/* Remove-Item Env:\TEST_VALUE */
/*dir env: */
console.log(`process.env.TEST_VALUE: ${process.env.TEST_VALUE}`);
