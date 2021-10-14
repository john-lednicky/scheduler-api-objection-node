Service Tests
=============

What are these?
---------------
These are jest integration tests of the service layer.

Each file migrates and seeds its own sqlite database, then deletes it afterwards.

These are intended to be comprehensive tests covering all error paths.


How to run
----------

[Jest CLI Options](https://jestjs.io/docs/cli)

**Example `Run single file`**
```
PS > yarn jest ./tests/services/assignmentService.test.js
```
```
PS tests\services> yarn jest eventService.test.js
```
**Example `Run all files`**
```
PS > yarn jest --config ./tests/jest.config.js
```
The config file should be specified relative to your current directory. 
If you don't get it right, you won't exclude many tests not designed for jest.
