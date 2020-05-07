"use strict"

var catch_table = document.getElementById('catch_table_body');
//var fish_name_input = document.getElementById("fish_name");
var fish_kg_input = document.getElementById("fish_kg");
var fish_length_input = document.getElementById("fish_length");
var fish_width_input = document.getElementById("fish_width");
//var location_name_input = document.getElementById("location_name");
var latitude_input = document.getElementById("latitude");
var longitude_input = document.getElementById("longitude");
var upload_fish_btn = document.getElementById("upload_fish");
var fileInput = document.getElementById('fish_image');
//selectors
var user_email_slc = document.getElementById('user_email');
var fish_name_slc = document.getElementById('fish_name');
var location_name_slc = document.getElementById('location_name');
//arrays
var users = [];
var fish = [];
var locations = [];

var date = new Date();
var email;
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


//let's populate the selectors
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch("http://localhost:3001/users/email", requestOptions)
    .then(response => response.json())
    .then(result => {
      for (var i = 0; i < result.length; i++) {
          //console.log(result[i].email);
          users.push(result[i].email);
      }
      for (var j = 0; j < users.length; j++) {
          var opt = users[j];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          user_email_slc.appendChild(el);
      }
    }).catch(error => console.log('error', error));

fetch("http://localhost:3001/fish/get-name", requestOptions)
    .then(response => response.json())
    .then(result => {
        for (var i = 0; i < result.length; i++) {
            //console.log(result[i].email);
            fish.push(result[i].name);
        }
        for (var j = 0; j < fish.length; j++) {
            var opt = fish[j];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            fish_name_slc.appendChild(el);
        }
    }).catch(error => console.log('error', error));

fetch("http://localhost:3001/locations/get-name", requestOptions)
    .then(response => response.json())
    .then(result => {
        for (var i = 0; i < result.length; i++) {
            //console.log(result[i].name);
            locations.push(result[i].name);
        }
        for (var j = 0; j < locations.length; j++) {
            var opt = locations[j];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            location_name_slc.appendChild(el);
        }
    }).catch(error => console.log('error', error));


//let's populate the table now shall we?
fetch("http://localhost:3001/fish/catch-list", requestOptions)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            var tempp = "";
            var email;
            var location_id;
            var fish_id;
            var url;

            data.forEach((u) => {
                var s1 = u.url;
                var s2 = s1.substr(1);
                tempp += "<tr>";
                tempp += "<td data-email= " + u.email + ">" + u.email + "</td>";
                tempp += "<td data-location-id= " + u.loc_id + ">" + u.location + "</td>";
                tempp += "<td>" + u.latitude + "</td>";
                tempp += "<td>" + u.longitude + "</td>";
                tempp += "<td data-fish-id= " + u.fish_id + ">" + u.fish + "</td>";
                tempp += "<td>" + u.kg + "</td>";
                tempp += "<td>" + u.length + "</td>";
                tempp += "<td>" + u.width + "</td>";
                tempp += "<td data-url= " + u.url + "><img src=" + s2 + " style='width:100px;height:60px;'></img></td>";
                tempp += "<td>" + "<button type='button' class='del_catch_button' data-email= " + u.email + " data-location-id= " + u.loc_id + " data-fish-id= " + u.fish_id + " data-url= " + u.url + "> Delete </button>" + "</td>";
                tempp += "</tr>";
            });
            catch_table.innerHTML = tempp;

            var delete_catch_btn = document.getElementsByClassName("del_catch_button");

            //delete customer button
            for (var i = 0; i < delete_catch_btn.length; i++) {
                delete_catch_btn[i].addEventListener("click", () => {
                    email = event.target.dataset.email;
                    location_id = event.target.dataset.locationId;
                    fish_id = event.target.dataset.fishId;
                    url = event.target.dataset.url;
                    deleteCatch(email, location_id, fish_id, url);
                });
            }


        }
    }).catch(error => console.log('error', error));


function deleteCatch(email, location_id, fish_id, url) {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const data = {
                'email': email,
                'loc_id': location_id,
                'fish_id': fish_id,
                'url': url
            };

            var raw = JSON.stringify(data);

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:3001/fish/delete-catch", requestOptions)
                .then(response => response.text())
                .then((result) => {
                    console.log(result);
                    location.reload();
                }).catch(error => console.log('error', error));
}




upload_fish_btn.addEventListener("click", ()=>{
    email = user_email_slc.value
    fish_name = fish_name_slc.value;
    fish_kg = fish_kg_input.value;
    fish_length = fish_length_input.value;
    fish_width = fish_width_input.value;
    location_name = location_name_slc.value;
    latitude = latitude_input.value;
    longitude = longitude_input.value;
    time = date.getTime();
    image_name = fileInput.files[0];
    image_path = fileInput.value;

    var formdata = new FormData();
    formdata.append("email", email);
    formdata.append("fish_name", fish_name);
    formdata.append("kg", fish_kg);
    formdata.append("length", fish_length);
    formdata.append("width", fish_width);
    formdata.append("location_name", location_name);
    formdata.append("latitude", latitude);
    formdata.append("longitude", longitude);
    formdata.append("timestamp", time);
    formdata.append("fishImage", image_name, image_path);

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://localhost:3001/fish/upload-fish", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            location.reload(true);
        }).catch(error => console.log('error', error));
});