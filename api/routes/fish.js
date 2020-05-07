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

//upload fish (text and image)
router.post('/upload-fish', upload.single("fishImage"), (req, res) => {

    var data = req.body;
    var img = req.file;
    var url = img.destination + img.filename;
    var values = [data.fish_name, data.kg, data.length, data.width, 
        data.location_name, data.latitude, data.longitude, data.email, 
        data.timestamp, url, url];

    sql = "INSERT INTO fish_info (fish_id, kg, length, width) " +
          "VALUES ((SELECT id FROM fish WHERE name = ?), ?, ?, ?); " +
          "SET @fishID = LAST_INSERT_ID(); " +
          "INSERT INTO location_info (location_id, latitude, longitude) " +
          "VALUES ((SELECT id FROM location WHERE name = ?), ?, ?); " +
          "SET @locID = LAST_INSERT_ID();" +
          "INSERT INTO caught_fish (user_id, fish_info_id, location_info_id, timestamp) " +
          "VALUES ((SELECT id FROM user where email = ?), @fishID, @locID, ?);" +
          "INSERT INTO image(url) " +
          "VALUES(?); " +
          "INSERT INTO fish_image(fish_info_id, image_id) " +
          "VALUES(@fishID, (SELECT id FROM image where url = ?)); ";
    
    connection.query(sql, values, (err, rows, fields) => {
        if(err) {
            res.send(err);
        } else {
            res.send("fish uploaded!");
        }
    });      
});

//create fish (text and image)
router.post('/create-fish', upload.single("defaultImage"), (req, res) => {
    var data = req.body;
    var img = req.file;
    var url = img.destination + img.filename;
    var values = [data.name, data.family, data.colour, data.description, url];

    sql = "INSERT INTO fish (name, family, colour, description, default_image) " +
          "VALUES (?, ?, ?, ?, ?);";
    
    connection.query(sql, values, (err, rows, fields) => {
        if(err) {
            res.send(err);
        } else {
            res.send("fish created");
        }
    }); 
});


//get fish caught in specific location
router.post('/fish-in-location', (req, res) => {
    var location = req.body.location;
    sql = "SELECT timestamp, fish.name, fish.family, fish.colour, fish.default_image, fish_info.kg, " +
          "fish_info.length, fish_info.width, location_info.latitude, location_info.longitude, " +
          "image.url " +
          "FROM caught_fish " +
          "JOIN fish_info ON fish_info_id = fish_info.id " +
          "JOIN fish ON fish_info.fish_id = fish.id " +
          "JOIN fish_image ON fish_info.id = fish_image.fish_info_id " +
          "JOIN image ON fish_image.image_id = image.id " +
          "JOIN location_info ON caught_fish.location_info_id = location_info.id " +
          "JOIN location ON location_info.location_id = location.id " +
          "WHERE location.name = ?;";

    connection.query(sql, [location], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

//get distinct fish info of caught fish
router.post('/distinct-caught', (req, res) => {
    var location = req.body.location;
    sql = "SELECT DISTINCT fish.name, fish.colour, fish.default_image " +
          "FROM caught_fish " +
          "JOIN fish_info ON fish_info_id = fish_info.id " +
          "JOIN fish ON fish_info.fish_id = fish.id " +
          "JOIN location_info ON location_info_id = location_info.id " +
          "JOIN location ON location_info.location_id = location.id " +
          "WHERE location.name = ?;";

    connection.query(sql, location, (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

//get all fish names
router.get('/get-name', (req, res) => {
    sql = "SELECT name FROM fish;";

    connection.query(sql, (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

//get all fish info
router.get('/get-info', (req, res) => {
    sql = "SELECT * FROM fish;";

    connection.query(sql, (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

//fetch fish caught by user
router.post('/caught-by-user', (req, res) => {
    var email = req.body.email;
    sql = "SELECT fish.name as fish_name, fish_info.kg, fish_info.length, fish_info.width, " +
          "image.url, location.name as location_name, caught_fish.timestamp " +
          "FROM user " +
          "JOIN caught_fish ON user.id = caught_fish.user_id " +
          "JOIN fish_info ON caught_fish.fish_info_id = fish_info.id " +
          "JOIN fish ON fish_info.fish_id = fish.id " +
          "JOIN fish_image ON fish_info.id = fish_image.fish_info_id " +
          "JOIN image ON fish_image.image_id = image.id " +
          "JOIN location_info ON caught_fish.location_info_id = location_info.id " +
          "JOIN location ON location_info.location_id = location.id " +
          "WHERE user.email = ?; ";
    connection.query(sql, email, (err, rows, fields) => {
        if(err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });      
});


//seelct fish caught by user for admin
router.get('/catch-list', (req, res) => {
    sql = "SELECT user.email, location.name as location, location_info.id as loc_id, location_info.latitude, " +
          "location_info.longitude, fish.name as fish, fish_info.id as fish_id, fish_info.kg, " +
          "fish_info.length, fish_info.width, image.url " +
          "FROM user " +
          "JOIN caught_fish ON user.id = caught_fish.user_id " +
          "LEFT JOIN location_info ON caught_fish.location_info_id = location_info.id " +
          "LEFT JOIN location ON location_info.location_id = location.id " +
          "LEFT JOIN fish_info ON caught_fish.fish_info_id = fish_info.id " +
          "LEFT JOIN fish ON fish_info.fish_id = fish.id " +
          "LEFT JOIN fish_image ON fish_info.id = fish_image.fish_info_id " +
          "LEFT JOIN image ON fish_image.image_id = image.id;";
    
    connection.query(sql, (err, rows, fields) => {
        if(err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

router.delete('/delete-catch', (req, res) => {
    var data = req.body;
    var values = [data.email, data.loc_id, data.fish_id, data.fish_id, data.url];

    sql = "DELETE FROM caught_fish " +
          "WHERE user_id = (SELECT id FROM user WHERE email = ?); " +
          "DELETE FROM location_info " +
          "WHERE id = ?; " +
          "DELETE FROM fish_image " +
          "WHERE fish_info_id = ?; " +
          "DELETE FROM fish_info " +
          "WHERE id = ?; " +
          "DELETE FROM image " +
          "WHERE url = ?; ";

    connection.query(sql, values, (err, rows, fields) => {
        if(err) {
            res.send(err);
        } else {
            try {
                fs.unlinkSync(data.url);
                console.log(data.url + " deleted from server");
                } catch (err) {
                    console.error(err);
                }
            res.send("catch deleted!");
        }
    });      
});


//delete fish
router.delete('/delete-info', (req,res) => {
    var id = req.body.id;
    sql = "DELETE FROM fish WHERE id = ?";
    connection.query(sql, id, (err, rows, fields) => {
        if(err) {
            res.send(err); 
        } else {
            res.send("fish delted!");
        }
    });
});


module.exports = router;
