"use strict"

var fish_table = document.getElementById('fish_table_body');
var create_fish = document.getElementById('create_fish');

var name_input = document.getElementById('fish_name');
var family_input = document.getElementById('fish_family');
var colour_input = document.getElementById('fish_colour');
var description_input = document.getElementById('fish_description');
var fileInput = document.getElementById('fish_image');
var fish_name;
var fish_family;
var fish_colour;
var fish_description;
var image_name;
var image_path;

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch("http://localhost:3001/fish/get-info", requestOptions)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            var tempp = "";
            var fish_id;

            data.forEach((u) => {
                var s1 = u.default_image;
                var s2 = s1.substr(1);
                tempp += "<tr>";
                tempp += "<td>" + u.name + "</td>";
                tempp += "<td>" + u.family + "</td>";
                tempp += "<td data-fish-id= " + u.id + " style='background-color: " + u.colour + ";'></td>";
                tempp += "<td>" + u.description + "</td>";
                tempp += "<td><img src=" + s2 + " style='width:100px;height:60px;'></img></td>";
                tempp += "<td>" + "<button type='button' class='del_fish_button' data-fish-id= " + u.id + "> Delete </button>" + "</td>";
                tempp += "</tr>";
            });
            fish_table.innerHTML = tempp;

            var delete_fish_btn = document.getElementsByClassName("del_fish_button");

            //delete customer button
            for (var i = 0; i < delete_fish_btn.length; i++) {
                delete_fish_btn[i].addEventListener("click", () => {
                    fish_id = event.target.dataset.fishId;
                    deleteFish(fish_id);
                });
            }


        }
    }).catch(error => console.log('error', error));


    create_fish.addEventListener("click", () => {
        fish_name = name_input.value;
        fish_family = family_input.value;
        fish_colour = "#" + colour_input.value;
        fish_description = description_input.value;
        image_name = fileInput.files[0];
        image_path = fileInput.value;

        var formdata = new FormData();
        formdata.append("name", fish_name);
        formdata.append("family", fish_family);
        formdata.append("colour", fish_colour);
        formdata.append("description", fish_description);
        formdata.append("defaultImage", image_name, image_path);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/fish/create-fish", requestOptions)
            .then(response => response.text())
            .then((result) => {
                console.log(result);
                location.reload(true);
            }).catch(error => console.log('error', error));
    });




    function deleteFish(id) {
        console.log("method got: ", id);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const data = {
            'id': id
        };

        var raw = JSON.stringify(data);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/fish/delete-info", requestOptions)
            .then(response => response.text())
            .then((result) => {
                console.log(result);
                location.reload();
            }).catch(error => console.log('error', error));
    }