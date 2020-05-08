"use strict"

var users_table = document.getElementById('users_table_body');


var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch("https://fishcloud.azurewebsites.net/users/", requestOptions)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            var tempp = "";
            var user_id;

            data.forEach((u) => {
                tempp += "<tr>";
                tempp += "<td>" + u.name + "</td>";
                tempp += "<td data-user-id= " + u.id + ">" + u.email + "</td>";
                tempp += "<td>" + "<button type='button' class='del_user_button' data-user-id= " + u.id + "> Delete </button>" + "</td>";
                tempp += "</tr>";
            });
            users_table.innerHTML = tempp;

            var delete_user_btn = document.getElementsByClassName("del_user_button");

            //delete customer button
            for (var i = 0; i < delete_user_btn.length; i++) {
                delete_user_btn[i].addEventListener("click", () => {
                    user_id = event.target.dataset.userId;
                    deleteUser(user_id);
                });
            }


        }
    }).catch(error => console.log('error', error));



function deleteUser(id) {

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

    fetch("https://fishcloud.azurewebsites.net/users/delete", requestOptions)
        .then(response => response.text())
        .then((result) => {
            console.log(result);
            location.reload(true);
        }).catch(error => console.log('error', error));

}