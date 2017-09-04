var Adapter = require("../database/Adapter");
var db = new Adapter()
var rp = require('request-promise');
var twilioSmsService = require('./twilio')

const VoiceResponse = require('twilio').twiml.VoiceResponse;

// require the Twilio module and create a REST client

module.exports = {
  configure: function(app) {
    app.post('/record', (req, res) => {
      // Use the Twilio Node.js SDK to build an XML response
      const twiml = new VoiceResponse();
      twiml.say('Hello. Please note that your recording cannot exceed ninety seconds. Leave the message after the beep. ');

      // Use <Record> to record and transcribe the caller's message
      twiml.record({
        transcribe: true,
        transcribeCallback: '/handle_transcribe',
        recordingStatusCallback: '/recording-status',
        recordingStatusCallbackMethod: 'POST'
      });

      // End the call with <Hangup>
      twiml.hangup();

      // Render the response as XML in reply to the webhook request
      res.type('text/xml');
      res.send(twiml.toString());
    });

    app.post('/handle_transcribe', function(req, res) {
      var call_sid = req.body.CallSid;
      var RecordingSid = req.body.RecordingSid;
      var from = req.body.From
      var to = req.body.To
      var TranscriptionText = req.body.TranscriptionText
      var rec_url = req.body.RecordingUrl
      var rec = rec_url.replace("https://api.twilio.com", "")
      var uri = rec + ".json"
      var user_id;
      // Get user id from db 
      db.getWPUser(from)
        .then(function(response) {
          console.log('[routes.js - 44]')
          console.log(response) 
          // if usser id does not exist
          if (response.length == 0) {
            console.log("no industry")

          } else {
            // if user id exists
            // var industry = response[0].industry_id
            user_id = response[0].user_id
            console.log('\n\ntext-processing\n\n')
            if (TranscriptionText) {
              rp.post('http://text-processing.com/api/sentiment/', {
                  form: {
                    text: TranscriptionText
                  }
                })
                .then(function(req, res) {
                  senti = JSON.parse(req)
                  console.log(senti)
                  var positivity = senti.probability.pos
                  var negativity = senti.probability.neg
                  var neutrality = senti.probability.neutral
                  var label = senti.label

                  db.getRecordingAndTranscriptionDetailsWP(RecordingSid)
                    .then(function(transDetails) {
                      console.log(transDetails)
                      if (transDetails.length > 0) {
                        console.log('line-72')
                        console.log(user_id, call_sid, RecordingSid, from, to, uri, TranscriptionText, positivity, negativity, neutrality, label)
                        db.updateTranscriptionAndSentimentWP(user_id, call_sid, RecordingSid, from, to, uri, TranscriptionText, positivity, negativity, neutrality, label)
                      } else {
                        db.insertTranscriptionAndSentimentWP(user_id, call_sid, RecordingSid, from, to, uri, TranscriptionText, positivity, negativity, neutrality, label)
                      }
                      return transDetails;
                    })
                    .then(function(result) {
                      // console.log(from, to)
                      console.log('[route/index.js]-78')
                      console.log(result[0].is_deleted)
                      if (result[0].is_deleted > 0) {
                        console.log('result[0].is_deleted>0')
                        console.log(result[0].is_deleted > 0)
                        var msg = 'Your twilio recording exceeds the limit of 90 seconds. And hence it has been discarded. Please record your message again.'
                        console.log(to, from, msg)
                        twilioSmsService.sendMessageToClient(from.toString(), to.toString(), msg.toString())
                      } else {
                        var msg = 'Your twilio recording has been saved successfully. Please attach the background image and reply with the following format :\n<Title>, <URL> '
                        return twilioSmsService.sendMessageToClient(from.toString(), to.toString(), msg.toString())
                      }
                    })
                });
            } else {
              console.log('No Transcription Text')
            }
          }
        });
    });
    /*Old db*/
    // app.post('/handle_transcribe', function(req, res) {
    //   var call_sid = req.body.CallSid;
    //   var RecordingSid = req.body.RecordingSid;
    //   var from = req.body.From
    //   var to = req.body.To
    //   var TranscriptionText = req.body.TranscriptionText
    //   var rec_url = req.body.RecordingUrl
    //   var rec = rec_url.replace("https://api.twilio.com", "")
    //   var uri = rec + ".json"
    //   var caller_id;

    //   db.dbdetails(from, function(response) {
    //     console.log('[routes.js - 44]')
    //     console.log(response)
    //     if (response == "") {
    //       console.log("no industry")

    //     } else {
    //       var industry = response[0].industry_id
    //       caller_id = response[0].id
    //       console.log('\n\ntext-processing\n\n')
    //       if (TranscriptionText) {
    //         rp.post('http://text-processing.com/api/sentiment/', {
    //             form: {
    //               text: TranscriptionText
    //             }
    //           })
    //           .then(function(req, res) {
    //             senti = JSON.parse(req)
    //             console.log(senti)
    //             var positivity = senti.probability.pos
    //             var negativity = senti.probability.neg
    //             var neutrality = senti.probability.neutral
    //             var label = senti.label

    //             db.getRecordingAndTranscriptionDetails(RecordingSid)
    //               .then(function(transDetails) {
    //                 console.log(transDetails)
    //                 if (transDetails.length > 0) {
    //                   console.log('line-72')
    //                   console.log(caller_id, industry, call_sid, RecordingSid, from, to, uri, TranscriptionText, positivity, negativity, neutrality, label)
    //                   db.updateTranscriptionAndSentiment(caller_id, industry, call_sid, RecordingSid, from, to, uri, TranscriptionText, positivity, negativity, neutrality, label)
    //                 } else {
    //                   db.insertTranscriptionAndSentiment(caller_id, industry, call_sid, RecordingSid, from, to, uri, TranscriptionText, positivity, negativity, neutrality, label)
    //                 }
    //                 return transDetails;
    //               })
    //               .then(function(result) {
    //                 // console.log(from, to)
    //                 console.log('[route/index.js]-78')
    //                 console.log(result[0].is_deleted)
    //                 if (result[0].is_deleted > 0) {
    //                   console.log('result[0].is_deleted>0')
    //                   console.log(result[0].is_deleted > 0)

    //                   var msg = 'Your twilio recording exceeds the limit of 90 seconds. And hence it has been discarded. Please record your message again.'
    //                   console.log(to, from, msg)
    //                   twilioSmsService.sendMessageToClient(from.toString(), to.toString(), msg.toString())
    //                 } else {
    //                   // console.log('result[0].is_deleted==0')
    //                   // console.log(result[0].is_deleted == 0)

    //                   var msg = 'Your twilio recording has been saved successfully. Please attach the background image and reply with the following format :\n<Title>, <URL> '

    //                   // console.log('[routes]-114')
    //                   // console.log(to, from, msg)

    //                   return twilioSmsService.sendMessageToClient(from.toString(), to.toString(), msg.toString())
    //                 }
    //               })
    //           });
    //       } else {
    //         console.log('No Transcription Text')
    //       }
    //     }
    //   });
    // });

    // app.post('/recording-status', function(req, res) {
    //   console.log(req.body)
    //   var is_deleted;
    //   if (parseInt(req.body.RecordingDuration) <= 90) {
    //     is_deleted = 0
    //   } else {
    //     is_deleted = 1
    //   }
    //   db.getRecordingAndTranscriptionDetails(req.body.RecordingSid)
    //     .then(function(result) {
    //       console.log(result)
    //       if (result.length > 0) {
    //         db.updateRecordingDetails(parseInt(req.body.RecordingDuration), req.body.RecordingSid, is_deleted)
    //       } else {
    //         db.insertRecordingDetails(parseInt(req.body.RecordingDuration), req.body.RecordingSid, is_deleted)
    //       }
    //     })

    // });

    app.post('/recording-status', function(req, res) {
      console.log(req.body)
      var is_deleted;
      if (parseInt(req.body.RecordingDuration) <= 90) {
        is_deleted = 0
      } else {
        is_deleted = 1
      }
      db.getRecordingAndTranscriptionDetailsWP(req.body.RecordingSid)
        .then(function(result) {
          console.log(result)
          if (result.length > 0) {
            db.updateRecordingDetailsWP(parseInt(req.body.RecordingDuration), req.body.RecordingSid, is_deleted)
          } else {
            db.insertRecordingDetailsWP(parseInt(req.body.RecordingDuration), req.body.RecordingSid, is_deleted)
          }
        })

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
      var e_industry = req.body.industry_id

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
      var new_industry_id = req.body.industry_id
      console.log(ext_id, new_name, new_industry_id, new_phone_number1, new_phone_number2, new_phone_number3)
      if (new_phone_number1 && new_phone_number2 && new_phone_number3) {
        console.log("3")
        db.update_industry_expert_details_p3(ext_id, new_name, new_industry_id, new_phone_number1, new_phone_number2, new_phone_number3, function(response) {
          console.log(response)
          res.json(response)
        })
      } else if (new_phone_number1 && new_phone_number2) {
        console.log("2")
        db.update_industry_expert_details_p2(ext_id, new_name, new_industry_id, new_phone_number1, new_phone_number2, function(response) {
          console.log(response)
          res.json(response)
        })
      } else if (new_phone_number1) {
        console.log("1")
        db.update_industry_expert_details(ext_id, new_name, new_industry_id, new_phone_number1, function(response) {
          // console.log(response)
          res.json(response)
        })

      }
      return true;
    })

    app.get('/get_industry_list', function(req, res) {
      db.industrydetails(function(response) {
        // console.log(response)
        res.send(response)
      });
    });

    app.get('/recordings/:is_approved', function(req, res) {
      return db.getRecordings(req, res);
    });

    app.get('/check', function(req, res) {
      db.dbdetails("+19188622354", function(response) {
        console.log(response, response[0].industry)
      });
    })


    app.put('/approval_status', function(req, res) {
      console.log(237)
      console.log(req.body)
      return db.editApprovalStatus(req, res)
    })

    app.put('/transcription', function(req, res) {
      console.log(243)
      console.log(req.body)
      return db.editTranscription(req, res)
    })

    // app.get('/user/:phone', function(req, res){
    //   // console.log(req.)
    //   return db.getWPUser(req, res)
    // })

  }
}