"use strict"


const express = require('express');
const connection = require('../../db');
const router = express.Router();

var sql;


//create user
// router.post('/create-user', (req, res) => {
//     var user = req.body;
//     var values = [user.name, user.email];
//     sql = "INSERT INTO user (name, email) VALUES (?, ?)";
    
//     connection.query(sql, values, (err, rows, fields) => {
//         if(err) {
//             res.send(err);
//         } else {
//             res.send("User was created!");
//         }
//     });
// });

// //check if email exists in db
// router.post('/check-email', (req, res) => {
//     var email = req.body.email;
//     sql = "SELECT email " +
//           "FROM user " +
//           "WHERE email = ?;";
//     connection.query(sql, [email], (err, rows, fields) => {
//         if (err) {
//             res.send(err);
//         } else {
//             if (rows == 0) {
//                 res.send(false);
//             } else {
//                 res.send(true);
//             }
//         }
//     });
// });

router.post('/register-user', (req, res) => {
    var email = req.body.email;
    var name = req.body.name;
    var values = [name, email];

    sql = "SELECT email " +
          "FROM user " +
          "WHERE email = ?;";

    var sql2 = "INSERT INTO user (name, email) VALUES (?, ?)";

    connection.query(sql, [email], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            if (rows == 0) {
                    connection.query(sql2, values, (err, rows, fields) => {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send("User was created!");
                        }
                    });
            } else {
                res.send("user already exists!");
            }
        }
    });
});


//login admin on the web page
router.post('/login', (req, res) => {
    var email = req.body.email;
    var name = req.body.name;
    var values = [name, email];

    sql = "SELECT * " +
          "FROM user " +
          "WHERE email = ?;";


    connection.query(sql, [email], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            if (rows == 0) {
                res.send(false);
            } else {
                res.send(rows);
            }
        }
    });
});

//select all users
router.get('/', (req, res) => {
    sql = "SELECT * FROM user;";
    connection.query(sql, (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

//get all users emails
router.get('/email', (req, res) => {
    sql = "SELECT email FROM user;";
    connection.query(sql, (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});


//delete user
router.delete('/delete', (req, res) => {
    var id = req.body.id;
    sql = "DELETE FROM user WHERE id = ?";
    connection.query(sql, id, (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send("user deleted!")
        }
    });
});

module.exports = router;