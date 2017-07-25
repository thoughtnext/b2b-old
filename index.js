const express = require('express');
var Adapter = require("./database/Adapter");
var db = new Adapter()
var rp = require('request-promise');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();
    var bodyParser = require('body-parser')
    app.use(bodyParser.urlencoded({
        extended: true
    }));
        app.set('port', process.env.PORT || 3000)

// Returns TwiML which prompts the caller to record a message
app.post('/record', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();
  twiml.say('Hello. Please leave a message after the beep.');

  // Use <Record> to record and transcribe the caller's message
  twiml.record({transcribe: true, transcribeCallback: '/handle_transcribe'});

  // End the call with <Hangup>
  twiml.hangup();

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});
app.post('/handle_transcribe',function(req,res){
console.log("------",req.body)
var call_sid=req.body.CallSid;
var RecordingSid=req.body.RecordingSid;
var from=req.body.From
var to=req.body.To
var TranscriptionText=req.body.TranscriptionText
var rec_url=req.body.RecordingUrl
var rec=rec_url.replace("https://api.twilio.com","")
var uri=rec+".json"
if(from='+19188622354'){
  var industry="education"

}else{
var industry="logistics"
}

console.log(call_sid,RecordingSid,from,to,TranscriptionText)
   rp.post('http://text-processing.com/api/sentiment/', {
                    form: {
                        text:TranscriptionText,

                    }
                }).then(function(req, res) {
                   senti=JSON.parse(req)
                   console.log(senti)
                   var positivity=senti.probability.pos
                    var negativity=senti.probability.neg
                    var neutrality=senti.probability.neutral
                    var label=senti.label
                 
                   db.insert(industry,call_sid,from,to,uri,TranscriptionText,positivity,negativity,neutrality,label,function(response){
console.log(response)
                   });
                   // arr.push({rsid:element.rsid,pos:senti.probability.pos,neg:senti.probability.neg,label:senti.label})
                });

});
// Create an HTTP server and listen for requests on port 3000
   app.listen(app.get('port'), function() {
        console.log('Server listening on ', app.get('port'))
    })















