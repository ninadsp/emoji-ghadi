/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express(),   
    Twit = require('twit'),
    config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */      
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(config.twitter);

var clock_face = {
  '0000': '🕛',
  '0030': '🕧',
  '0100': '🕐',
  '0130': '🕜',
  '0200': '🕑',
  '0230': '🕝',
  '0300': '🕒',
  '0330': '🕞',
  '0400': '🕓',
  '0430': '🕟',
  '0500': '🕔',
  '0530': '🕠',
  '0600': '🕕',
  '0630': '🕡',
  '0700': '🕖',
  '0730': '🕢',
  '0800': '🕗',
  '0830': '🕣',
  '0900': '🕘',
  '0930': '🕤',
  '1000': '🕙',
  '1030': '🕥',
  '1100': '🕚',
  '1130': '🕦',
  '1200': '🕛',
  '1230': '🕧',
}

var digits = [
  '0️⃣',
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '6️⃣',
  '7️⃣',
  '8️⃣',
  '9️⃣'
]

var calendar_icon = '🗓';

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

app.use(express.static('public'));

app.all("/post_time", function(req, res) {
  var now = new Date();
  
  T.post('statuses/update', { status: translate_time(now) }, function(err, data, response){
    if(err) {
      console.log('error!: ', err);
      res.sendStatus(500);
    }
    else {
      res.sendStatus(200);
    }
  });
  
  console.log('post_time called: ' + translate_time(now) );
});

app.all("/post_date", function(req, res) {
  var now = new Date();
  
  T.post('statuses/update', { status: calendar_icon + ': ' + translate_date(now) }, function(err, data, response){
    if(err) {
      console.log('error!: ', err);
      res.sendStatus(500);
    }
    else {
      res.sendStatus(200);
    }
  });
  
  console.log('post_date called: ' + calendar_icon + ': ' + translate_date(now) ) ;
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your bot is running on port ' + listener.address().port + ' with timezone set to ' + process.env.TZ);
});


/*
Takes in a Date object and returns it as (string)  2️⃣0️⃣-1️⃣1️⃣-2️⃣0️⃣1️⃣9️⃣
*/
function translate_date(in_date_object) {
  
  var in_date = in_date_object.getDate() + ' - ' + ( in_date_object.getMonth() + 1 ) + ' - ' + in_date_object.getFullYear();
  var out_date = [];
  
  for (var i = 0; i < in_date.length; i++) {
    var current_char = in_date[i];
    switch(current_char) {
      case ':': case ' ': case '-': case '/':
        out_date[i] = current_char;
        break;
      default:
        out_date[i] = digits[in_date[i]] ;
    }
  }
  
  return out_date.join('');
}

/*
Takes in a Date object returns the nearest clock_face value
*/
function translate_time(in_date_object) {
  
  var in_time = '';
  var minutes = in_date_object.getMinutes();
  var hours = String(in_date_object.getHours() % 12).padStart(2, '0');
  
  if ( minutes <= 15) {
    in_time = hours + '00';
  }
  else if ( minutes <= 45) {
    in_time = hours + '30';
  }
  else {
    in_time = String(in_date_object.getHours() % 12 + 1).padStart(2, '0') + '00';
  }
  console.log('in_time: ' + in_time);
  return clock_face[in_time];
}