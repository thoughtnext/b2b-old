const express = require('express');
const routes = require('./routes/index')
const app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
// var urlencodedParser = bodyParser.urlencoded({
// 	extended: false
// })
app.use(bodyParser.json())

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Accept,Content-Length, X-Requested-With, X-PINGOTHER');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
console.log('hi')
app.use(allowCrossDomain);

app.set('port', process.env.PORT || 6600)
routes.configure(app)
// Returns TwiML which prompts the caller to record a message

// Create an HTTP server and listen for requests on port 3000
app.listen(app.get('port'), function() {
  console.log('Server listening on ', app.get('port'))
})