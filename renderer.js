// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron')
const request = require('request')
const fkill = require('fkill')

// localforage.removeItem('user', function(err) {
//   console.log("clear");
// });

$(".login").on("click",(e) => {
  e.preventDefault();

  // kill screen_recording application before starting the exams
  var blocked_apps = ['svchost.exe', 'camtasia.exe', 'camstudio.exe', 'snagit.exe', 'icecreamscreenrecorder.exe', 
                    'icecreamscreenrecorder', 'snagit', 'camtasia', 'obsstudio', 'monosnap', 'apowersoft', 'quicktimeplayer',
                    'kazam',9437, 'simplescreenrecorder', 'screenshot']
  var force = true
  var ignoreCase = true
  fkill(blocked_apps, [force, ignoreCase])

  if($("#agreement").is(":checked")){
    request({
      method: 'GET',
      url: "http://192.168.7.226:8000/get_question_lists/",
      json: true,
      body: {
        email: email,
        password: password,
      },
    }).on('data', function(data) {
      if(JSON.parse(data)['message'] == 'Error'){
        alert("Credential mismatched or You have already taken the test!");
      }
      else{
        var question_list = JSON.parse(data)
        ipcRenderer.send("test", question_list)
      }
    });
  }
  else{
    alert("Please read and agree to exam code of conducts.")
  }
})

var email;
var password;
$("#email").change(() => {
    email = ($("#email").val());
  });
$("#password").change(() => {
      password = ($("#password").val());
    });
$("#agreement").change(() => {
  agreement = ($("#agreement").prop("checked"));
});

// email
var input = document.querySelector("[name=email]");
input.oninput = function(event) {
    event.target.setCustomValidity("");
};
input.oninvalid = function(event) {
    event.target.setCustomValidity("Please Enter the correct Email");
};