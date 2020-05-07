"use strict"

var locations_table = document.getElementById('locations_table_body');
var name_input = document.getElementById('location_name');
var lat_input = document.getElementById('latitude');
var lon_input = document.getElementById('longitude');
var create_location = document.getElementById('create_location');

var loc_name;
var latitude;
var longitude;
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};


fetch("http://localhost:3001/locations/all", requestOptions)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            var tempp = "";
            var loc_id;

            data.forEach((u) => {
                tempp += "<tr>";
                tempp += "<td>" + u.name + "</td>";
                tempp += "<td>" + u.latitude + "</td>";
                tempp += "<td data-loc-id= " + u.id + ">" + u.longitude + "</td>";
                tempp += "<td>" + "<button type='button' class='del_loc_button' data-loc-id= " + u.id + "> Delete </button>" + "</td>";
                tempp += "</tr>";
            });
            locations_table.innerHTML = tempp;

            var delete_loc_btn = document.getElementsByClassName("del_loc_button");

            //for every delete location button
            for (var i = 0; i < delete_loc_btn.length; i++) {
                delete_loc_btn[i].addEventListener("click", () => {
                    loc_id = event.target.dataset.locId;
                    deleteLocation(loc_id);
                });
            }


        }
    }).catch(error => console.log('error', error));



create_location.addEventListener("click", () => {
    loc_name = name_input.value;
    latitude = lat_input.value;
    longitude = lon_input.value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "name": loc_name,
        "latitude": latitude,
        "longitude": longitude
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    

    fetch("http://localhost:3001/locations/create", requestOptions)
        .then(response => response.text())
        .then((result) => {
            console.log(result);
            location.reload(true);
        }).catch(error => console.log('error', error));

});




function deleteLocation(id) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "id": id
    });

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3001/locations/delete", requestOptions)
        .then(response => response.text())
        .then((result) => {
            console.log(result);
            location.reload(true);
        }).catch(error => console.log('error', error));

}


