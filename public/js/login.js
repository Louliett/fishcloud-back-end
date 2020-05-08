"use strict"

var errormsg = document.getElementById('error-label');
var email_input = document.getElementById('email');
var pass_input = document.getElementById('password');
var login_btn = document.getElementById('login');
var email;
var password;

login_btn.addEventListener("click", () => {
    
    email = email_input.value;
    password = pass_input.value;

    if (email === "" || password === "") {
        errormsg.innerHTML = "Fields are empty!";
    } else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": email
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3001/users/login", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result === false) {
                    errormsg.innerHTML = "Incorrect email and password";
                } else {
                    if (result[0].password === password) {
                        location.href = "/public/admin/fish.html";
                    } else {
                        errormsg.innerHTML = "Incorrect password";
                    }
                }
            }).catch(error => console.log('error', error));
    }

});