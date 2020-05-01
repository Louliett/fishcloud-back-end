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
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb('Invalid file type');
    }
}

router.post('/test', upload.single("fishImage"), (req, res) => {
    let data = req.body.id;
    var img = req.file;
    console.log(data, "data");
    console.log(img.filename, "filename");
    console.log(img.destination, "path");
    res.send("done");
    
    
});

//upload fish (text and image)
router.post('/upload-fish', upload.single("fishImage"), (req, res) => {

    var data = req.body;
    var img = req.file;
    var values = [data.fish_name, data.kg, data.length, data.width, 
        data.location_name, data.latitude, data.longitude, data.user_id, 
        data.timestamp, img.filename, img.destination, img.filename];

    sql = "INSERT INTO fish_info (fish_id, kg, length, width) " +
          "VALUES ((SELECT id FROM fish WHERE name = ?), ?, ?, ?); " +
          "SET @fishID = LAST_INSERT_ID(); " +
          "INSERT INTO location_info (location_id, latitude, longitude) " +
          "VALUES ((SELECT id FROM location WHERE name = ?), ?, ?); " +
          "SET @locID = LAST_INSERT_ID();" +
          "INSERT INTO caught_fish (user_id, fish_info_id, location_info_id, timestamp) " +
          "VALUES (?, @fishID, @locID, ?);" +
          "INSERT INTO image(name, path) " +
          "VALUES(?, ?); " +
          "INSERT INTO fish_image(fish_info_id, image_id) " +
          "VALUES(@fishID, (SELECT id FROM image where name = ?)); ";
    
    connection.query(sql, values, (err, rows, fields) => {
        if(err) {
            res.send(err);
        } else {
            res.send("fish uploaded!");
        }
    });      
});


//get fish caught in specific location
router.post('/fish-in-location', (req, res) => {
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
