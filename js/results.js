var helper = require('sendgrid').mail;
var email;
const {ipcRenderer} = require('electron');


let notattempted = 0
let correct = 0
let wrong = 0

ipcRenderer.on('email', (event, email) => {
  $("#email").html(email)
})

$(".close").click(function() {
  window.close();
});
