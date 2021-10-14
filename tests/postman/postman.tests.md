Postman Tests
=============

What are these?
---------------
These are end-to-end integration tests using the Postman application.

These tests exercise the authentication subsystem and the authenticating proxy in addition to the API.

- **Initial API.postman_collection.json** This is the XML export of the Postman "collection", which defines the tests.

- **localhost.postman_environment.json** This is the XML export of the Postman "environment", which stores the values of variables used in the tests.

- **Authenticating-Proxy.postman_collection.json** This is the XML export of a Postman collection that more completely tests dex and oauth2-proxy. These tests are not maintained since the integration of the authentication subsystem with the API.

- **Authenticating-Proxy.postman_environment.json** This is the XML export of the Postman environment that supports Authenticating-Proxy.postman_collection.json


How to run
----------

[Postman: Using the Collection Runner](https://learning.postman.com/docs/running-collections/intro-to-collection-runs/)

1. Install Postman.
2. Import the collection.
3. Import the environment.
4. Open the collection.
5. Select the environment.
6. Run the collection.

You may have to fuss with the environment variables.

[Postman: Running collections on the command line with Newman](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)

These tests can also be run from the command line using "Newman", but that has not been tried in this project.