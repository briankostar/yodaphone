//load modules
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var unirest = require('unirest');

var app = express();

app.set('port', process.env.PORT || 8080);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//define mongoose schema.
var messageSchema = new mongoose.Schema({
  time: Date,
  body: String
});

//create model
var Message = mongoose.model('Message', messageSchema);
//connect to MongoLab. User/pass open for now.
mongoose.connect('mongodb://kostar:d*3la1ba9DEe*#@ds027509.mongolab.com:27519/mongokostar');

//Define API Routes
app.get('/api/v1', function(req, res){res.send('hello this is API version 1')});

//return all saved messages in database
app.get('/api/v1/history', function(req, res, next){
  //res.send('hello this is GET for api/v1/history');
  Message.find(function(err, msgs) {
    if (err)
      res.send(err);
    res.json(msgs);
  });
});

//POST to our database after making GET request to yoda API
app.post('/api/v1/history', function(req, res, next){
  var header = 'X-Mashape-Key'
  var apiKey = 'yEx4uK6uChmsh71x4HefoPsGNKEtp1cqfvrjsnBuxfNUudWTVh'

  //get message_to_pass and parse it
  var message_to_pass = req.body.msg_sent;
  console.log("MSG_TO_PARSE: " + message_to_pass);
  var message_to_pass = message_to_pass.replace(/ /g, '+');
  console.log("MSG_TO_PASS: " + message_to_pass);

  //asynch request w message_to_pass to yoda API
  unirest.get("https://yoda.p.mashape.com/yoda?sentence=" + message_to_pass)
  .header(header, apiKey)
  .end(function (result) {
    var message_to_save = result.body;
    console.log("MSG_TO_SAVE:" + message_to_save);
      //Save Yodafied message to database
      var msg = new Message();
      msg.body = message_to_save;
      msg.time = new Date();
      msg.save(function(err){
      if(err)
   	res.send(err);
      res.json({message: 'Translated!'});
      });
    return res.send({body: message_to_save});
  });
 
});

//redirect other route to '/#' which angular will redirect to '/'
app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

//error middleware
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

//start server
app.listen(app.get('port'), function() {
  console.log('Magic at port ' + app.get('port'));
});

