Node.js MySQL Example
=====================
This example uses the [mysql](https://github.com/mysqljs/mysql#readme) package
to connect to MySQL and wraps its functionality in an async friendly **query**
function.

Async Wrapper Example
---------------------
To see how the async wrapper is used, check the [query command](src/query.mjs)
for an example.  To use the wrapper:

 * pass a valid MySQL connection URL to the **connect** function
 * use the returned **query** function to execute SQL
 * invoke the **.close()** method on the function when finished

Command Usage Example
---------------------
This package includes a CLI command name **query** which can be used to run
queries against a MySQL database.  An example of its usage:

```sh
query mysql://root:sekret@127.0.0.1:3306/myschema "select stuff from table"
```

The results are written to the console as line-delimited JSON documents.
