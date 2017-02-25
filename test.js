const   
  firebase = require('firebase'),
  moment = require('moment'),
  moment_tz = require('moment-timezone');

var fireconfig = {
    apiKey: "AIzaSyCUzJ7tbOhUrNhidRvn5p5LLyHPO6hvSf4",
    authDomain: "assistant-a6320.firebaseapp.com",
    databaseURL: "https://assistant-a6320.firebaseio.com",
    storageBucket: "assistant-a6320.appspot.com",
    messagingSenderId: "562103774535"
  };
firebase.initializeApp(fireconfig);
var database = firebase.database();

function getLoggedWork(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date. getDate();
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
    ];

  var work = database.ref('/worklog/' + year + '/' + monthNames[month] + '/' + day)
            .once('value').then(function(snapshot) {
                return snapshot.val();
            });

  work.then(function(data){
      var msg = '';
      for(var key in data) {
          msg += key + ': ' + data[key].work + '\n';
      }
      console.log(msg);
  });
}

getLoggedWork(new Date('2/7/2017'));