var apiai = require('apiai');

var app = apiai("feabbba42a94417db519221d210bc82e");

var request = app.textRequest('who am i?', {
    sessionId: '668d9b46-f95d-4c40-b761-b0c41d55432s'
});

request.on('response', function(response) {
    if(response.result.fulfillment.speech)
      console.log(response.result.fulfillment.speech);
    else {
      console.log(response.result.action);
    }
});

request.on('error', function(error) {
    console.log(error);
});

request.end();
