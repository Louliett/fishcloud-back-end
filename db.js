"use strict"

const mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'root.mysql.database.azure.com',
  user: 'root@fishcloud',
  password: 'root',
  database: 'root',
  multipleStatements: true
});

//connect to the database
connection.connect((err) => {
  if(err) {
    console.log("DB Connection Failed!" + err);
  } else {
    console.log("DB Connection Successful!");
  }
});



module.exports = connection;
