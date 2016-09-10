const
  bodyParser = require('body-parser'),
  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  https = require('https'),
  request = require('request');
  dns = require('dns');
  got = require('got');
  cheerio = require('cheerio');

var app = express();
app.listen(process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));

app.get('/hello', function(req, res){
  res.send('world!');
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'building-bot') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          recievedMessage(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });
    res.sendStatus(200);
  }
});


function recievedMessage(event) {
  var senderId = event.sender.id;
  var recipientId = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  if (message.text === '#quote') {
    dns.lookup('brainyquote.com', err => {
  		if (err && err.code === 'ENOTFOUND') {
  			sendTextMessage(senderId, "Sad Day! The philosophers are busy :(");
  		}
	  });
  	const url = 'http://www.brainyquote.com/quotes_of_the_day.html';
  	got(url).then(res => {
  		const $ = cheerio.load(res.body);
      var options = getRandomInt(0,4);
  		const quote = $('.bqQuoteLink').eq(options).text().trim();
  		var msg = `“${quote}”`;
      sendTextMessage(senderId, msg + senderId);
  	});
  }

  if (message.text === "who am i?") {
    var urlstr = 'https://graph.facebook.com/v2.6/'+ senderId +'?fields=first_name,last_name&access_token=EAAElWHwFC5UBAHUTz3tvUCIicreqS7KDknS5TaOKuZAZCSJwF5zhDE4FF2hFKTU8JGMopwLsWhhC0eKkiMJfeEqdAGfZAZAltSyHO9RXaToS6X5PsDgzGYEaHBln1ScGJT0opPyOKvIj9pZAb1N1cnpnYZAeKwdTAsGmjnuDzeeAZDZD'
    https.get(urlstr, (res) => {
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
        var jdata = JSON.parse(`${chunk}`);
        var msg = "Oh you think i don\'t remember? You are ";
        sendTextMessage(senderId, msg +
          jdata.first_name + " " + jdata.last_name);
      });
      res.on('end', () => {
        console.log('No more data!');
      });
    });
  }
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAElWHwFC5UBAHUTz3tvUCIicreqS7KDknS5TaOKuZAZCSJwF5zhDE4FF2hFKTU8JGMopwLsWhhC0eKkiMJfeEqdAGfZAZAltSyHO9RXaToS6X5PsDgzGYEaHBln1ScGJT0opPyOKvIj9pZAb1N1cnpnYZAeKwdTAsGmjnuDzeeAZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}


function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', '2b5743c5d4261050faf6b6ea61ccbf98')
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
