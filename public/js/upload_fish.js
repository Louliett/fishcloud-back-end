"use strict"

var fish_name_input = document.getElementById("fish_name");
var fish_kg_input = document.getElementById("fish_kg");
var fish_length_input = document.getElementById("fish_length");
var fish_width_input = document.getElementById("fish_width");
var location_name_input = document.getElementById("location_name");
var latitude_input = document.getElementById("latitude");
var longitude_input = document.getElementById("longitude");
var upload_fish_btn = document.getElementById("upload_fish");
var fileInput = document.getElementById('fish_image');
var date = new Date();

var fish_name;
var fish_kg;
var fish_length;
var fish_width;
var location_name;
var latitude;
var longitude;
var time;
var image_name;
var image_path;


upload_fish_btn.addEventListener("click", ()=>{
    fish_name = fish_name_input.value;
    fish_kg = fish_kg_input.value;
    fish_length = fish_length_input.value;
    fish_width = fish_width_input.value;
    location_name = location_name_input.value;
    latitude = latitude_input.value;
    longitude = longitude_input.value;
    time = date.getTime();
    image_name = fileInput.files[0];
    image_path = fileInput.value;

    var formdata = new FormData();
    formdata.append("fish_name", fish_name);
    formdata.append("kg", fish_kg);
    formdata.append("length", fish_length);
    formdata.append("width", fish_width);
    formdata.append("location_name", location_name);
    formdata.append("latitude", latitude);
    formdata.append("longitude", longitude);
    formdata.append("user_id", 1);
    formdata.append("timestamp", time);
    formdata.append("fishImage", image_name, image_path);

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://localhost:3001/fish/upload-fish", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
});