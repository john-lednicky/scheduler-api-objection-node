migrations
==========

What are these?
---------------
These are knex "migrations" that create the tables in the database schema.
A knex migration runs only that files whose names are datestamped after the last one that was run. 
The last filename is stored in a table in the database created by knex.

How to run
----------

[knex-migrate on npm](https://www.npmjs.com/package/knex-migrate)

**Example `Apply all schema changes that have not yet been applied`**
```
PS > npx knex migrate:latest
```
```
PS > npx knex migrate:latest --env test   
```

**Example `Rollback last set of changes that were applied`**
```
PS > npx knex migrate:rollback
```
```
PS > npx knex migrate:rollback --env test  
```
