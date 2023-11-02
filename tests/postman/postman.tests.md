Postman Tests
=============

What are these?
---------------
These are end-to-end integration tests using the Postman application.

These tests exercise the authentication subsystem and the authenticating proxy in addition to the API.

- **Initial api.integration-tests.json** This Postman collection tests authentication and all endpoints in the application. When the application is running locally in Docker, this collection should run successfully. The collection starts by logging in, so the cookie is set for the remaining tests.

- **api.integration-tests.environment.json** This environment contains only the protocol and host used to access the proxy. It is sufficient to run the collection. Variables set during the test run are set at the collection level, not the environment level.


How to run
----------

[Postman: Using the Collection Runner](https://learning.postman.com/docs/running-collections/intro-to-collection-runs/)

1. Install Postman.
2. Import the collection.
3. Import the environment.
4. Open the collection.
5. Select the environment.
6. Run the collection.


[Postman: Running collections on the command line with Newman](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)

These tests can also be run from the command line using "Newman", but that has not been tried in this project.