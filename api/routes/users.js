"use strict"


const express = require('express');
const connection = require('../../db');
const router = express.Router();

var sql;


//create user
router.post('/create-user', (req, res) => {
    var user = req.body;
    var values = [user.name, user.email];
    sql = "INSERT INTO user (name, email) VALUES (?, ?)";
    
    connection.query(sql, values, (err, rows, fields) => {
        if(err) {;
            res.send(err);
        } else {
            res.send("User was created!");
        }
    });
});

//check if email exists in db
router.post('/check-email', (req, res) => {
    var email = req.body.email;
    sql = "SELECT email " +
          "FROM user " +
          "WHERE email = ?;";
    connection.query(sql, [email], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            if (rows == 0) {
                res.send(false);
            } else {
                res.send(true);
            }
        }
    });
});

module.exports = router;