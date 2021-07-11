console.log(process.env);

const result = require('dotenv').config()

if (result.error) {
  throw result.error
}

console.log(`process.env.LOCAL_MYSQL_DBNAME: ${process.env.LOCAL_MYSQL_DBNAME}`);
console.log(`process.env.LOCAL_MYSQL_USERNAME: ${process.env.LOCAL_MYSQL_USERNAME}`);
console.log(`process.env.LOCAL_MYSQL_PASSWORD: ${process.env.LOCAL_MYSQL_PASSWORD}`);
console.log(`process.env.LOCAL_MYSQL_HOST: ${process.env.LOCAL_MYSQL_HOST}`);

/* $env:TEST_VALUE="flibbertegibbet" */
/* Remove-Item Env:\TEST_VALUE */
/*dir env: */
console.log(`process.env.TEST_VALUE: ${process.env.TEST_VALUE}`);
