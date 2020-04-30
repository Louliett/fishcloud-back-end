"use strict"


const express = require('express');
const connection = require('../../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

var sql;
var storage = multer.diskStorage({
    destination: './public/fish_images/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}); //.array('myImage', 5);

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb('Invalid file type');
    }
}

//temporary method
router.get('/fish-locations', (req, res) => {
    sql = "SELECT location.name AS loc_name, location_info.latitude, location_info.longitude, " +
          "fish.name AS fish_name, fish.family, fish.colour, fish_info.kg, fish_info.length, fish_info.width " +
          "FROM caught_fish " +
          "JOIN location_info ON location_info_id = location_info.id " +
          "JOIN location ON location_info.location_id = location.id " +
          "JOIN fish_info ON fish_info_id = fish_info.id " +
          "JOIN fish on fish_info.fish_id = fish.id;";
    
    connection.query(sql, (err, rows, fields) => {
        if(err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });      
});

//temporary method 2
router.post('/location-fish', (req, res) => {
    var location = req.body.location;
    sql = "SELECT fish.name AS fish_name, fish.family, fish.colour, fish_info.kg, fish_info.length, fish_info.width " +
          "FROM caught_fish " +
          "JOIN location_info ON location_info_id = location_info.id " +
          "JOIN location ON location_info.location_id = location.id " +
          "JOIN fish_info ON fish_info_id = fish_info.id " +
          "JOIN fish on fish_info.fish_id = fish.id " +
          "WHERE location.name = ?;";

    connection.query(sql, [location], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

module.exports = router;
