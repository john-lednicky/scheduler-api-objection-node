db tests
========
What are these?
---------------
These tests verify the scaffolding for the data access stack using a previously created and seeded MySQL database on localhost. 

They are not idempotent and are not intended to be run as automated tests.

### envconfig.test.js
This displays environment variables and verifies that dotenv is picking up the database secrets from the .env file in the root.

### dbconnect.test.js
This connects to the database using knex and runs a few operations.

### model.*.*.test.js
These exercise the four Objection models. The scaffolding from these files is used in the services.

### scratch.test.js
A scratchpad to try out syntax before using them in a real file. Frequently overwritten.

How to run
----------
The tests use the knexfile.js file and the .env at the root of the project, so they must be run from there
The knexfile relies on some environment variables that must be loaded by dotenv 

**Example `model.eventType.test.js`**
```
node ./tests/db/model.eventType.select.test.js
```