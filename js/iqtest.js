const {ipcRenderer} = require('electron')
const request = require('request')
const Promise = require('bluebird')
let  email;

let max;
ipcRenderer.on('question_list', (event, message) => {
  main(message)
})

function main(message) {
  max = message['question'].length
  const questions = message['question']
  const options = message['option']

  email = message['email']

  var user_id = document.createElement("input");
  user_id.type = 'hidden'
  user_id.value = email
  user_id.id = 'user_id'
  document.body.appendChild(user_id);
  
  //Add question into question_list: setItem()
  for(i=0; i<questions.length; i++){
    localforage.setItem('q'+(i+1), questions[i], function(err,value){
      if(err) {
        console.log(err);
      }
    });
  }
  
  function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }

  var Q = []
  //Add question into question_list: getItem()
  for (i=0; i<questions.length; i++) {
    Q.push('q'+(i+1))
  }
  shuffle(Q)

  let count = 1
  let temp
  let question_id

  //loadQuestion(count);
  loadQuestionLinks();

  function loadQuestionLinks(){
    var str="";
    for(i=0;i<max;i++){
      str+= `<a class="btn-floating waves-effect waves-light btn q-jump red accent-4" data-id="${i}">${i+1}</a>`;
    }
    $(".q-jump-container").html(str);
  }

  const nextQuestion = function() {
    if(count == max){
      count += 1
    }
    count = (count+1)%(max+1)
    loadQuestion(count-1);
  }

  const prevQuestion = function(){
    if(count == 1){
      count = max+1
    }
    count = (count-1)%(max+1)
    loadQuestion(count-1);
  }

  loadQuestion(count-1);

  function loadQuestion(count){
    temp = count
    localforage.getItem(Q[count], function(err, question) {
      question_id = question.id
      $(".q-jump").removeClass("green").addClass("red")
      $(".q-jump[data-id="+count+"]").addClass("green")
      $(".question-content").html(question.question_name);
      if (question.img_option != null){
        question_img_url = "http://192.168.7.226:8000" + question.img_option;
        $(".question_img").attr("src", question_img_url);
      }
      else{
        $(".question_img").attr("src", "");
      }
      //`QCM` type question
      if(question.question_type == 'QCM'){
        if($(".q-jump[data-id="+(temp)+"]").hasClass("blue")){
          var selected_option = question.selected_option
          $("input:radio").each(function(){
            if($(this).attr('id') == selected_option){
              $(this).attr('checked', 'checked');
              $(this).selectpicker("render");
            }
          })
          $(".q-jump[data-id="+(temp)+"]").click();
        }
        var qContainer = $("#q-options");
        let optionStr="";
        for(i=0; i<options.length; i++){
          if(options[i].question_id == question.id){
            if(options[i].img_option != null){
              option_img_url  = "http://192.168.7.226:8000" + options[i].img_option
              optionStr += `
                <li class="collection-item">
                  <input type="radio" class="option" name="options" value="${i+1}" id="${options[i].id}"/>
                  <label style="color: black;" for="${options[i].id}">${options[i].option_name}</label>
                  <img class="option_img" src="${option_img_url}">
                </li>
              `;
            }
            else{
              optionStr += `
                <li class="collection-item">
                  <input type="radio" class="option" name="options" value="${i+1}" id="${options[i].id}"/>
                  <label style="color: black;" for="${options[i].id}">${options[i].option_name}</label>
                </li>
              `;
            }
          }
        }
        qContainer.html(optionStr);
      }
      //`Essay` type question
      else{
        var qContainer = $("#q-options");
        let optionStr="";
        optionStr += `
              <textarea class="option answers" id="question${question_id}" rows="15"></textarea>
          `;
        qContainer.html(optionStr);
        if($(".q-jump[data-id="+(temp)+"]").hasClass("blue")){
          var answer = question.essay_answer
          $("#question"+question_id).val(answer)
        }
      }
    });
  }

  $(".nxt").click(() => {
    nextQuestion();
  });

  $(".prev").click(() => {
    prevQuestion();
  });

  $(".q-jump").click(function(){
    var id = $(this).attr('data-id');
    loadQuestion(id);
  });

  $(".answers").on('change','.option',()=>{
    localforage.getItem(Q[temp],(err,value) => {
      if(value.question_type == 'QCM'){
        value.selected = $(".option:checked").val()
        value.selected_option = $(".option:checked").attr("id")
        if(value.selected = true){
          $(".q-jump[data-id="+temp+"]").addClass("blue")
        }
      }
      else{
        if($("#question"+question_id).val()){
          value.essay_answer = $("#question"+question_id).val()
          $(".q-jump[data-id="+temp+"]").addClass("blue")
        }
      }
      localforage.setItem(Q[temp], value, (err,value) => {
        if(err) {
          console.log(err)
        }
      })
    })
  });

  $(".submit-btn").click(() => {
    var submit_answer = []
    const promises = []

    for(var i = 0; i < questions.length; i++){
      promises.push(localforage.getItem(Q[i]))
    }

    Promise.all(promises)
    .then(datas => {
      console.log('data return ', datas)
      submit_answer.push(...datas)
      console.log('submit ans', submit_answer, 'length', submit_answer.length)
      request({
        method: 'POST',
        url: "http://192.168.7.226:8000/submit_answer/",
        json: true,
        body: {
          email: email,
          answer: submit_answer,
          },
      }).on('data', function(data) {
        ipcRenderer.send("submit-test", email)
      });
    }).catch(error => {
      console.error(error.message)
    })
  })
}

$("#timer").timer({
    countdown: true,
    duration: '60ms',
    format: '%H:%M:%S',
    callback: function() {
        window.location = "results.html"
    }
});
