"use strict"

const mysql = require('mysql');
// const readline = require("readline");
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
// var host, user, password, database;

// rl.question("Please input the host: ", async (hos) => {
//   rl.question("Please input the user: ", async (us) => {
//     rl.question("Please input the password: ", async (pass) => {
//       rl.question("Please input the database: ", async (db) => {
//         host = hos;
//         user = us;
//         password = pass;
//         database = db;
//       });
//     });
//   });
// });

// console.log(host);
// console.log(user);
// console.log(password);
// console.log(database);




var connection = mysql.createConnection({
  host: 'fishcloud.mysql.database.azure.com',
  user: 'fishadmin@fishcloud',
  password: 'fishcloud1!',
  database: 'fishcloud',
  multipleStatements: true
});

//connect to the data base
connection.connect((err) => {
  if(err) {
    console.log("DB Connection Failed!" + err);
  } else {
    console.log("DB Connection Successful!");
  }
});



module.exports = connection;
