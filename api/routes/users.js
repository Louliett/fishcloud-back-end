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



module.exports = router;