db tests
========
What are these?
---------------
These tests verify the scaffolding for the data access stack using a previously created and seeded MySQL database on localhost. 

### envconfig.test.js
This displays environment variables and verifies that dotenv is picking up the database secrets from the .env file in the root.

### dbconnect.test.js
This connects to the database using knex and runs a few operations.

### model.*.*.test.js
These exercise the four Objection models. The scaffolding from these files is used in the services.

### scratch.test.js
A scratchpad to try out syntax before using them in a real file. Frequently overwritten.

They are not idempotent and are not intended to be run as automated tests.

How to run
----------
The tests use the knexfile.js file and the .env in /server
For the relative paths to resolve correctly, the tests must be run from the scheduler-node-objection-react/server

**Example `model.eventType.test.js`**
```
PS C:\Users\johnd\Documents\scheduler\scheduler-node-objection-react\server> node tests/db/model.eventType.select.test.js
```