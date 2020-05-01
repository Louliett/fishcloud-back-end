"use strict"


const express = require('express');
const connection = require('../../db');
const router = express.Router();

var sql;


//get locations in which fish was caught
router.get('/locations', (req, res) => {
    sql = "SELECT DISTINCT location.name AS loc_name, location_info.latitude, " +
          "location_info.longitude, location_info.timestamp" +
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



module.exports = router;