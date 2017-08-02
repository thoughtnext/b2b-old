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

app.use(allowCrossDomain);

app.set('port', process.env.PORT || 3000)

// Returns TwiML which prompts the caller to record a message
app.post('/record', (request, response) => {
	// Use the Twilio Node.js SDK to build an XML response
	const twiml = new VoiceResponse();
	twiml.say('Hello. Please leave a message after the beep.');

	// Use <Record> to record and transcribe the caller's message
	twiml.record({
		transcribe: true,
		transcribeCallback: '/handle_transcribe'
	});

	// End the call with <Hangup>
	twiml.hangup();

	// Render the response as XML in reply to the webhook request
	response.type('text/xml');
	response.send(twiml.toString());
});
app.post('/handle_transcribe', function(req, res) {
	console.log("------", req.body)
	var call_sid = req.body.CallSid;
	var RecordingSid = req.body.RecordingSid;
	var from = req.body.From
	var to = req.body.To
	var TranscriptionText = req.body.TranscriptionText
	var rec_url = req.body.RecordingUrl
	var rec = rec_url.replace("https://api.twilio.com", "")
	var uri = rec + ".json"
		// if (from = '+19188622354') {
		// 	var industry = "education"

	// } else {
	// 	var industry = "logistics"
	// }
	db.dbdetails(from, function(response) {
		console.log(response)
		if (response == "") {
			console.log("no industry")
		} else {
			var industry = response[0].industry

			console.log(call_sid, RecordingSid, from, to, TranscriptionText)
			rp.post('http://text-processing.com/api/sentiment/', {
				form: {
					text: TranscriptionText,

				}
			}).then(function(req, res) {
				senti = JSON.parse(req)
				console.log(senti)
				var positivity = senti.probability.pos
				var negativity = senti.probability.neg
				var neutrality = senti.probability.neutral
					// var label = senti.label
				if (senti.label == "neutral") {
					var label = "pos"
				} else {
					var label = senti.label
				}

				db.insert(industry, call_sid, from, to, uri, TranscriptionText, positivity, negativity, neutrality, label, function(response) {
					console.log(response)
				});
				// arr.push({rsid:element.rsid,pos:senti.probability.pos,neg:senti.probability.neg,label:senti.label})
			});
		}

	});

});

app.post('/loginvalidation', function(req, res) {
	var email = req.body.email
	var password = req.body.password
	db.loginvalidation(email, password, function(response) {
		console.log(response)
		if (response == "") {
			res.json({
				code: 400,
				message: "invalid credentials"
			})
		} else {

			res.json({
				code: 200,
				message: "valid credentials"
			})
		}

	})
})
app.get('/expertdetails', function(req, res) {
	db.expertdetails(function(response) {
		console.log(response)
			// res.send(response)
		if (response.code == 200) {
			res.send(response.result)
		}
	})
})
app.post('/insert_expert_details', function(req, res) {

	var e_name = req.body.name
	var e_phone_number1 = req.body.phone_number1
	var e_phone_number2 = req.body.phone_number2
	var e_phone_number3 = req.body.phone_number3



	var e_industry = req.body.industry
	console.log(e_name, e_phone_number1, e_phone_number2, e_phone_number3, e_industry)
	if (e_phone_number1 && e_phone_number2 && e_phone_number3) {
		console.log("3")
		db.insert_industry_expert_details3(e_name, e_industry, e_phone_number1, e_phone_number2, e_phone_number3, function(response) {
			console.log(response)
			if (response.code == "200") {
				res.json({
					code: "200",
					success: "true"
				})
			} else {
				res.json({
					code: "400",
					success: "false"
				})
			}
		});
	} else if (e_phone_number1 && e_phone_number2) {
		console.log("2")
		db.insert_industry_expert_details2(e_name, e_industry, e_phone_number1, e_phone_number2, function(response) {
			console.log(response)
			if (response.code == "200") {
				res.json({
					code: "200",
					success: "true"
				})
			} else {
				res.json({
					code: "400",
					success: "false"
				})
			}
		});
	} else if (e_phone_number1) {
		console.log("1")
		db.insert_industry_expert_details(e_name, e_industry, e_phone_number1, function(response) {
			console.log(response)
			if (response.code == "200") {
				res.json({
					code: "200",
					success: "true"
				})
			} else {
				res.json({
					code: "400",
					success: "false"
				})
			}
		});


	}
	return true;

});
app.post('/edit_expert_details', function(req, res) {
	console.log(req.body)

	var ext_id = req.body.ext_id
	var new_name = req.body.name
	var new_phone_number1 = req.body.phone_number1
	var new_phone_number2 = req.body.phone_number2
	var new_phone_number3 = req.body.phone_number3
	var new_industry = req.body.industry
	console.log(ext_id, new_name, new_industry, new_phone_number1, new_phone_number2, new_phone_number3)
	if (new_phone_number1 && new_phone_number2 && new_phone_number3) {
		console.log("3")
		db.update_industry_expert_details_p3(ext_id, new_name, new_industry, new_phone_number1, new_phone_number2, new_phone_number3, function(response) {
			console.log(response)
			res.json(response)
		})
	} else if (new_phone_number1 && new_phone_number2) {
		console.log("2")
		db.update_industry_expert_details_p2(ext_id, new_name, new_industry, new_phone_number1, new_phone_number2, function(response) {
			console.log(response)
			res.json(response)
		})
	} else if (new_phone_number1) {
		console.log("1")
		db.update_industry_expert_details(ext_id, new_name, new_industry, new_phone_number1, function(response) {
			console.log(response)
			res.json(response)
		})

	}
	return true;
})
app.get('/get_industry_list', function(req, res) {
	db.industrydetails(function(response) {
		console.log(response)
		res.send(response)
	});
});
app.get('/check', function(req, res) {
		db.dbdetails("+19188622354", function(response) {
			console.log(response, response[0].industry)


		});
	})
	// Create an HTTP server and listen for requests on port 3000
app.listen(app.get('port'), function() {
	console.log('Server listening on ', app.get('port'))
})