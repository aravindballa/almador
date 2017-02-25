var accountSid = 'ACdc32fb6d46dee2b168914cca39a5044d'; 
var authToken = 'fd3c8135739a2a9e7402b1cdf72411c0'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 

function sendSMS(number, msg) {
    client.messages.create({ 
    to: number, 
    from: "+18329243742", 
    body: msg + '\n- Sent by Almador.', 
    }, function(err, message) { 
        console.log(message.sid); 
    });
}

module.exports = sendSMS;