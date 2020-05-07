"use strict"


const express = require('express');
const connection = require('../../db');
const router = express.Router();

var sql;


//create location
router.post('/create', (req, res) => {
    var loc = req.body;
    var values = [loc.name, loc.latitude, loc.longitude];
    sql = "INSERT INTO location (name, latitude, longitude) VALUES (?, ?, ?);";
    connection.query(sql, values, (err, rows, fields) => {
        if(err) {
           res.send(err); 
        } else {
            res.send("location created!");
        }
    });
});


//get distinct locations in which fish was caught
router.get('/', (req, res) => {
    sql = "SELECT DISTINCT location.name, location.latitude, " +
          "location.longitude " +
          "FROM caught_fish " +
          "JOIN location_info ON location_info_id = location_info.id " +
          "JOIN location ON location_info.location_id = location.id; ";

    connection.query(sql, (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});


//get all location names
router.get('/get-name', (req, res) => {
    sql = "SELECT name FROM location;";

    connection.query(sql, (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

//get all locations
router.get('/all', (req, res) => {
    sql = "SELECT * FROM location;";

    connection.query(sql, (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});


//delete location
router.delete('/delete', (req, res) => {
    var id = req.body.id;
    sql = "DELETE FROM location WHERE id = ?";
    connection.query(sql, id, (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send("location deleted!")
        }
    });
});


module.exports = router;