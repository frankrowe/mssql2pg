#! /usr/bin/env node

/*
 * mssql2pg
 * https://github.com/frankrowe/msssql2pg
 *
 * Copyright (c) 2013 Frank Rowe
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');

var userArgs = process.argv.slice(2);
var mssql_file = userArgs[0];
var pg_file = userArgs[1];
var pgsql;

/***
  [regex for datatype in mssql, pg equivalent]
***/
var type_lookup = [
  [/datetime/g, 'timestamp'],
  [/int identity\(1,1\)/g, 'serial primary key'],
  [/nvarchar/g, 'varchar']
];

function changeDataTypes(sql){
  for(var i = 0; i < type_lookup.length; i++){
    var lookup = type_lookup[i];
    sql = sql.replace(lookup[0], lookup[1]);
  }
  return sql;
}

fs.readFile(mssql_file, 'utf8', function (err, data) {
  if (err) throw err;
  pgsql = data.toLowerCase();
  pgsql = pgsql.replace(/\[/g, '');
  pgsql = pgsql.replace(/]/g, '');
  //make scheme public, should be option
  pgsql = pgsql.replace(/dbo./g, 'public.');
  pgsql = pgsql.replace(/on primary/g, '');
  pgsql = changeDataTypes(pgsql);
  pgsql += ';';
  fs.writeFile(pg_file, pgsql, function (err) {
    if (err) throw err;
  });
});

