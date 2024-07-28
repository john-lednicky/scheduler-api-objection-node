Service Tests
=============

What are these?
---------------
These are jest integration tests of the service layer.

Each file migrates and seeds its own sqlite database, then deletes it afterwards.

These are intended to be comprehensive tests covering all error paths.


How to run
----------

NOTE: Package.json has a script named "test" that simply runs "jest", so `yarn jest` and `yarn test` are equivalent.

[Jest CLI Options](https://jestjs.io/docs/cli)

**Example `Run single file`**
```
PS > yarn test ./tests/services/assignmentService.test.js
```
```
PS > yarn test eventService.test.js
```

**Example `Run single test in a file`** (Please note the backslashes that escape regex reserved parenthesis.)
```
PS > yarn test eventService.test.js -t "eventService.create\(\) - validation error eventTypeId missing"
```

**Example `Run all files`**
```
PS > yarn test
```
**Example `Run all files and display coverage`**
```
PS > yarn test --coverage
```

NOTE: The config file at `./jest.config.test` excludes a number of test files that are not intended to be run automatically.
