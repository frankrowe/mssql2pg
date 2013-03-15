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

/**
  [regex for datatype in mssql, pg equivalent]
**/
var type_lookup = [
  [/datetime/g, 'timestamp'],
  [/int identity\(1,1\)/g, 'serial primary key'],
  [/nvarchar/g, 'varchar'],
  [/nchar/g, 'char']
];

/**
 * [Uses lookup table to replace MSSQL Data Types with PG Data Types]
 * @param  {string} sql [sql with ms types]
 * @return {string}     [sql with pg types]
 */
function changeDataTypes(sql){
  for(var i = 0; i < type_lookup.length; i++){
    var lookup = type_lookup[i];
    sql = sql.replace(lookup[0], lookup[1]);
  }
  return sql;
}

/**
 * [Does basic formatting on MSSQL]
 * @param  {string} sql
 * @return {string} sql
 */
function formatMssql(sql){
  sql = sql.replace(/GO/g, '');
  sql = sql.replace(/SET ANSI_NULLS ON/g, '');
  sql = sql.replace(/SET QUOTED_IDENTIFIER ON/g, '');
  sql = sql.replace(/SET ANSI_PADDING ON/g, '');
  sql = sql.replace(/SET ANSI_PADDING OFF/g, '');
  sql = sql.toLowerCase();
  sql = sql.replace(/\[/g, '');
  sql = sql.replace(/]/g, '');
  //make scheme public, should be option
  sql = sql.replace(/dbo./g, 'public.');
  sql = sql.replace(/ on primary/g, ';');
  sql = sql.replace(/textimage_on primary/g, '');
  sql = sql.replace(/-/g, '_');
  sql += ';';
  return sql;
}

/**
 * [writes pg sql to disk or to stdout]
 */
function pgDone(pgsql){
  if(pg_file) {
    fs.writeFile(pg_file, pgsql, function (err) {
      if (err) throw err;
    });
  } else {
    console.log(pgsql);
  }
}

function init(){
  fs.readFile(mssql_file, 'utf8', function (err, data) {
    if (err) throw err;
    var pgsql = data;
    pgsql = formatMssql(pgsql);
    pgsql = changeDataTypes(pgsql);
    pgDone(pgsql);
  });
}

init();

