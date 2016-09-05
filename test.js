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

  dns.lookup('brainyquote.com', err => {
    if (err && err.code === 'ENOTFOUND') {
      console.log(msg);
    }
  });
  const url = 'http://www.brainyquote.com/quotes_of_the_day.html';
  got(url).then(res => {
    const $ = cheerio.load(res.body);
    var options = getRandomInt(0,4)
    const quote = $('.bqQuoteLink').eq(options).text().trim();

    var msg = `“${quote}”`;
    console.log(msg);
  });

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
