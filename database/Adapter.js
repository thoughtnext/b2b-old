'use strict';
// READ!!! http://taoofcode.net/promise-anti-patterns/
// READ!!! http://raganwald.com/2014/07/09/javascript-constructor-problem.html
// READ!!! https://www.firebase.com/docs/web/guide/
// READ!!! https://www.firebase.com/blog/2016-01-21-keeping-our-promises.html
// READ!!! http://stackoverflow.com/questions/17015590/node-js-mysql-needing-persistent-connection
// var Firebase = require("firebase");
var mysql = require("mysql");

var Q = require("q");
var moment = require('moment');
var options = {
  "host": process.env.MYSQL_HOST || "thoughtnext.com",
  "port": process.env.MYSQL_PORT || "3306",
  "user": process.env.MYSQL_USER || "restokit_readbone",
  "password": process.env.MYSQL_PASSWORD || "readbone@123",
  "database": process.env.MYSQL_DATABASE || "restokit_readbone"
};
// var options = {
//   "host": process.env.MYSQL_HOST || "b2bsoundbites.com",
//   "port": process.env.MYSQL_PORT || "3306",
//   "user": process.env.MYSQL_USER || "mediadmc_wf22r",
//   "password": process.env.MYSQL_PASSWORD || "Data916!!",
//   "database": process.env.MYSQL_DATABASE || "mediadmc_ddwf"
// };

function Adapter() {
  if (this instanceof Adapter) {
    // this.root = new Firebase(process.env.FIREBASE_URL || "https://glaring-heat-2025.firebaseio.com/");
    this.db = mysql.createPool(options);
  } else {
    return new Adapter();
  }
}

//get bot user on userid


Adapter.prototype.getdetails = function(sid, callback) {

  const query = "SELECT * FROM alexa_recordings WHERE call_sid = " + this.db.escape(sid);
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
        } else {
          callback(results)

          deferred.resolve(results);
        }
      });
    }
  });
  console.log("getdetails function finished")
  return deferred.promise;
}


Adapter.prototype.getWPUser = function(phone) {
  const query = "SELECT user_id FROM `wp_usermeta` WHERE meta_key='phone' AND meta_value=" + this.db.escape(phone);
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        console.log(query)
        connection.release();
        if (err) {
          console.log(err)
          // res.send(err)
          deferred.reject(err);
        } else {
          // callback(results)
          // res.send(results)
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("getWPUser function finished")
  return deferred.promise;
}


Adapter.prototype.getRecordingAndTranscriptionDetailsWP = function(rsid) {

  const query = "SELECT * FROM wp_soundbites WHERE rsid = " + this.db.escape(rsid);
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("getRecordingAndTranscriptionDetailsWP function finished")
  return deferred.promise;
}

Adapter.prototype.getRecordingAndTranscriptionDetails = function(rsid) {

  const query = "SELECT * FROM alexa_recordings WHERE rsid = " + this.db.escape(rsid);
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("getRecordingAndTranscriptionDetails function finished")
  return deferred.promise;
}

// Adapter.prototype.insertTranscriptionsAndSentiment = function(industry_expert_id, industry, call_sid, RecordingSid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label) {

//   console.log("-----------===", industry_expert_id, industry, call_sid, RecordingSid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label)

//   const query = "INSERT INTO alexa_recordings(industry_expert_id, industry,call_sid,rsid,from_number,to_number,uri,transcription,sentiment_positivity,sentiment_negativity,sentiment_neutrality,label)" +
//     "VALUES( " + this.db.escape(industry_expert_id) + "," + this.db.escape(industry) + "," + this.db.escape(call_sid) + "," + this.db.escape(RecordingSid) + "," + this.db.escape(from_number) + "," + this.db.escape(to_number) + "," + this.db.escape(uri) + "," + this.db.escape(transcription) + "," + this.db.escape(positivity) + "," + this.db.escape(negativity) + "," + this.db.escape(neutrality) + "," + this.db.escape(label) + ")";
//   console.log(query)
//   var deferred = Q.defer();
//   this.db.getConnection(function(err, connection) {
//     if (err) {
//       deferred.reject(err);
//     } else {
//       connection.query(query, [], function(err, results) {
//         connection.release();
//         if (err) {
//           deferred.reject(err);
//         } else {
//           deferred.resolve(results);
//         }
//       });
//     }
//   });
//   console.log("insert function finished")
//   return deferred.promise;
// }

Adapter.prototype.insertTranscriptionAndSentimentWP = function(wp_user_id, call_sid, RecordingSid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label) {

  console.log(wp_user_id, call_sid, RecordingSid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label)

  const query = "INSERT INTO wp_soundbites(wp_user_id,call_sid,rsid,from_number,to_number,uri,transcription,sentiment_positivity,sentiment_negativity,sentiment_neutrality,label)" +
    "VALUES( " + this.db.escape(industry_expert_id) + "," + this.db.escape(industry) + "," + this.db.escape(call_sid) + "," + this.db.escape(RecordingSid) + "," + this.db.escape(from_number) + "," + this.db.escape(to_number) + "," + this.db.escape(uri) + "," + this.db.escape(transcription) + "," + this.db.escape(positivity) + "," + this.db.escape(negativity) + "," + this.db.escape(neutrality) + "," + this.db.escape(label) + ")";
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("insertTranscriptionAndSentimentWP function finished")
  return deferred.promise;
}
Adapter.prototype.insertTranscriptionAndSentiment = function(wp_user_id, industry, call_sid, RecordingSid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label) {

  console.log(user_id, industry, call_sid, RecordingSid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label)

  const query = "INSERT INTO alexa_recordings(industry_expert_id, industry,call_sid,rsid,from_number,to_number,uri,transcription,sentiment_positivity,sentiment_negativity,sentiment_neutrality,label)" +
    "VALUES( " + this.db.escape(industry_expert_id) + "," + this.db.escape(industry) + "," + this.db.escape(call_sid) + "," + this.db.escape(RecordingSid) + "," + this.db.escape(from_number) + "," + this.db.escape(to_number) + "," + this.db.escape(uri) + "," + this.db.escape(transcription) + "," + this.db.escape(positivity) + "," + this.db.escape(negativity) + "," + this.db.escape(neutrality) + "," + this.db.escape(label) + ")";
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("insert function finished")
  return deferred.promise;
}

Adapter.prototype.insertRecordingDetails = function(duration, rsid, is_deleted) {
  console.log(rsid)
  const query = "INSERT INTO alexa_recordings(duration,rsid,is_deleted)" +
    "VALUES( " + this.db.escape(duration) + "," + this.db.escape(rsid) + "," + this.db.escape(is_deleted) + ")";
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("insertRecordingDetails function finished")
  return deferred.promise;
}
Adapter.prototype.insertRecordingDetailsWP = function(duration, rsid, is_deleted) {
  console.log(rsid)
  const query = "INSERT INTO wp_soundbites(duration,rsid,is_deleted)" +
    "VALUES( " + this.db.escape(duration) + "," + this.db.escape(rsid) + "," + this.db.escape(is_deleted) + ")";
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("insertRecordingDetailsWP function finished")
  return deferred.promise;
}

Adapter.prototype.updateTranscriptionAndSentimentWP = function(user_id, call_sid, rsid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label) {
  console.log('updateTranscriptionAndSentimentWP')
  // console.log(industry_expert_id, industry, call_sid, rsid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label)
  const query = "UPDATE `wp_soundbites` SET user_id = ?, call_sid = ?, from_number = ?, to_number = ?, uri = ?, transcription = ?, sentiment_positivity = ?, sentiment_negativity = ?, sentiment_neutrality = ?, label = ? WHERE  rsid =? "
  const params = [user_id, call_sid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label, rsid]
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, params, function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("updateTranscriptionAndSentimentWP function finished")
  return deferred.promise;
}

Adapter.prototype.updateTranscriptionAndSentiment = function(industry_expert_id, industry, call_sid, rsid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label) {
  console.log('updateTranscriptionAndSentiment')
  // console.log(industry_expert_id, industry, call_sid, rsid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label)
  const query = "UPDATE `alexa_recordings` SET industry_expert_id = ?,industry= ?, call_sid = ?, from_number = ?, to_number = ?, uri = ?, transcription = ?, sentiment_positivity = ?, sentiment_negativity = ?, sentiment_neutrality = ?, label = ? WHERE  rsid =? "
  const params = [industry_expert_id, industry, call_sid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label, rsid]
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, params, function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("updateTranscriptionAndSentiment function finished")
  return deferred.promise;
}


Adapter.prototype.updateRecordingDetails = function(duration, rsid, is_deleted) {

  const query = 'UPDATE `alexa_recordings` SET duration = ' + this.db.escape(duration) +
    ', is_deleted = ' + this.db.escape(is_deleted) + ' WHERE rsid =' + this.db.escape(rsid)

  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("updateRecordingDetails function finished")
  return deferred.promise;
}

Adapter.prototype.updateRecordingDetailsWP = function(duration, rsid, is_deleted) {

  const query = 'UPDATE `wp_soundbites` SET duration = ' + this.db.escape(duration) +
    ', is_deleted = ' + this.db.escape(is_deleted) + ' WHERE rsid =' + this.db.escape(rsid)

  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("updateRecordingDetailsWP function finished")
  return deferred.promise;
}




// Adapter.prototype.insertDetails = function(industry, call_sid, from_number, to_number, callback) {
//   console.log(industry, call_sid, from_number, to_number)
//   // return true;


//   const query = "INSERT INTO alexa_recordings(industry,call_sid,from_number,to_number)" +
//     "VALUES( " + this.db.escape(industry) + "," + this.db.escape(call_sid) + "," + this.db.escape(from_number) + "," + this.db.escape(to_number) + ")";
//   console.log(query)
//   var deferred = Q.defer();
//   this.db.getConnection(function(err, connection) {
//     if (err) {
//       deferred.reject(err);
//     } else {
//       connection.query(query, [], function(err, results) {
//         connection.release();
//         if (err) {
//           deferred.reject(err);
//         } else {
//           // console.log(results)
//           callback(results)
//           // deferred.resolve(results);
//         }
//       });
//     }
//   });
//   console.log("insertDetails function finished")
//   return deferred.promise;
// }

Adapter.prototype.updateDetails = function(call_sid, uri, rsid, callback) {
  const query = 'UPDATE alexa_recordings SET uri=' + this.db.escape(uri) + ',rsid=' + this.db.escape(rsid) + ' WHERE call_sid=' + this.db.escape(call_sid) + ';'
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        console.log(err, results)
        if (err) {
          console.log(err)
        } else {
          callback(results)
        }
        // connection.release();
        // if (err) {
        //   deferred.reject(err);
        // } else {
        //   // console.log(results)
        //   callback("updated successfully")
        //   // deferred.resolve(results);
        // }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}
Adapter.prototype.updatetrans_text = function(rsid, tran_text, callback) {

  const query = 'UPDATE alexa_recordings SET transcription=' + this.db.escape(tran_text) + ' WHERE rsid=' + this.db.escape(rsid) + ';'
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        console.log(err, results)
        if (err) {
          console.log(err)
        } else {
          callback(results)
        }
        // connection.release();
        // if (err) {
        //   deferred.reject(err);
        // } else {
        //   // console.log(results)
        //   callback("updated successfully")
        //   // deferred.resolve(results);
        // }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}

// Adapter.prototype.inserttranscriptions = function(rsid, trans_text, callback) {



//   const query = "INSERT INTO alexa_transcriptions(rsid,transcription)" +
//     "VALUES( " + this.db.escape(rsid) + "," + this.db.escape(trans_text) + ")";
//   console.log(query)
//   var deferred = Q.defer();
//   this.db.getConnection(function(err, connection) {
//     if (err) {
//       deferred.reject(err);
//     } else {
//       connection.query(query, [], function(err, results) {
//         connection.release();
//         if (err) {
//           deferred.reject(err);
//         } else {
//           // console.log(results)
//           callback(results)
//           // deferred.resolve(results);
//         }
//       });
//     }
//   });
//   console.log("getBotUser function finished")
//   return deferred.promise;
// }
//    Adapter.prototype.updatesentiment = function(pos,neg,label,rsid,callback) {
// const query = 'UPDATE alexa_recordings SET sentiment_positivity='+ this.db.escape(pos) +',sentiment_negativity='+ this.db.escape(neg) +',label='+ this.db.escape(label) +' WHERE rsid=' +  this.db.escape(rsid)  + ';'
// console.log(query)
//  var deferred = Q.defer();
//  this.db.getConnection(function(err, connection) {
//    if (err) {
//      deferred.reject(err);
//    } else {
//      connection.query(query, [], function(err, results) {
//        console.log(err, results)
//        if (err) {
//          console.log(err)
//        } else {
//          callback(results)
//        }
//        // connection.release();
//        // if (err) {
//        //   deferred.reject(err);
//        // } else {
//        //   // console.log(results)
//        //   callback("updated successfully")
//        //   // deferred.resolve(results);
//        // }
//      });
//    }

Adapter.prototype.updatesentiment = function(pos, neg, label, rsid, callback) {

  const query = 'UPDATE alexa_recordings SET sentiment_positivity=' + this.db.escape(pos) + ',sentiment_negativity=' + this.db.escape(neg) + ',label=' + this.db.escape(label) + ' WHERE rsid=' + this.db.escape(rsid) + ';'
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        console.log(err, results)
        if (err) {
          console.log(err)
        } else {
          callback(results)
        }
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          // console.log(results)
          callback("updated successfully")
          // deferred.resolve(results);
        }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}
Adapter.prototype.dbdetails = function(pnum, callback) {

  const query = "SELECT * " +
    "FROM industry_expert_details " +
    "WHERE phone_number2=" + this.db.escape(pnum) + " OR phone_number3=" + this.db.escape(pnum) + " OR phone_number1=" + this.db.escape(pnum)
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
        } else {
          callback(results)

          deferred.resolve(results);
        }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}
Adapter.prototype.loginvalidation = function(email, password, callback) {

  const query = "SELECT * " +
    "FROM admin " +
    "WHERE email = " + this.db.escape(email) + " And password =" + this.db.escape(password)
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
        } else {
          callback(results)

          deferred.resolve(results);
        }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}

Adapter.prototype.insert_industry_expert_details = function(name, industry_id, phone_number1, callback) {



  const query = "INSERT INTO industry_expert_details(name,industry_id,phone_number1)" +
    "VALUES( " + this.db.escape(name) + "," + this.db.escape(industry_id) + "," + this.db.escape(phone_number1) + ")";
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
          callback({
            code: "400",
            error: err
          })
        } else {
          // console.log(results)
          callback({
            code: "200",
            result: results
          })
          // callback(results)2h98ckc3
          // deferred.resolve(results);
        }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}
Adapter.prototype.insert_industry_expert_details2 = function(name, industry_id, phone_number1, phone_number2, callback) {
  // const query = "INSERT INTO industry_expert_details(name,industry,phone_number1,phone_number2)" +
  //   "VALUES( " + this.db.escape(name) + "," + this.db.escape(industry) + "," + this.db.escape(phone_number1) + "," + this.db.escape(phone_number2) + ")";
  const query = "INSERT INTO industry_expert_details(name,industry_id,phone_number1,phone_number2)" +
    "VALUES( " + this.db.escape(name) + "," + this.db.escape(industry_id) + "," + this.db.escape(phone_number1) + "," + this.db.escape(phone_number2) + ")";
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
          callback({
            code: "400",
            error: err
          })
        } else {
          // console.log(results)
          callback({
            code: "200",
            result: results
          })
          // callback(results)2h98ckc3
          // deferred.resolve(results);
        }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}
Adapter.prototype.insert_industry_expert_details3 = function(name, industry_id, phone_number1, phone_number2, phone_number3, callback) {

  // return true;



  const query = "INSERT INTO industry_expert_details(name,industry_id,phone_number1,phone_number2,phone_number3)" +
    "VALUES( " + this.db.escape(name) + "," + this.db.escape(industry_id) + "," + this.db.escape(phone_number1) + "," + this.db.escape(phone_number2) + "," + this.db.escape(phone_number3) + ")";
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
          callback({
            code: "400",
            error: err
          })
        } else {
          // console.log(results)
          callback({
            code: "200",
            result: results
          })
          // callback(results)2h98ckc3
          // deferred.resolve(results);
        }
      });
    }
  });
  console.log("insert_industry_expert_details3 function finished")
  return deferred.promise;
}
Adapter.prototype.update_industry_expert_details = function(ext_id, name, industry_id, phone_number1, callback) {



  const query = "UPDATE industry_expert_details SET name=" + this.db.escape(name) + ",industry_id=" + this.db.escape(industry_id) + ",phone_number1=" + this.db.escape(phone_number1) + " WHERE id= " + this.db.escape(ext_id)

  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
          callback({
            code: 400,
            success: "false"
          })
        } else {
          // console.log(results)
          callback({
            code: 200,
            success: "true"
          })

          // deferred.resolve(results);
        }
      });
    }
  });
  console.log("update_industry_expert_details function finished")
  return deferred.promise;
}
Adapter.prototype.update_industry_expert_details_p2 = function(ext_id, name, industry_id, phone_number1, phone_number2, callback) {
  const query = "UPDATE industry_expert_details SET name=" + this.db.escape(name) + ",industry_id=" + this.db.escape(industry_id) + ",phone_number1=" + this.db.escape(phone_number1) + ",phone_number2=" + this.db.escape(phone_number2) + " WHERE id= " + this.db.escape(ext_id)
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
          callback({
            code: 400,
            success: "false"
          })
        } else {
          // console.log(results)
          callback({
            code: 200,
            success: "true"
          })

          // deferred.resolve(results);
        }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}
Adapter.prototype.update_industry_expert_details_p3 = function(ext_id, name, industry_id, phone_number1, phone_number2, phone_number3, callback) {
  const query = "UPDATE industry_expert_details SET name=" + this.db.escape(name) + ",industry_id=" + this.db.escape(industry_id) + ",phone_number1=" + this.db.escape(phone_number1) + ",phone_number2=" + this.db.escape(phone_number2) + ",phone_number3=" + this.db.escape(phone_number3) + " WHERE id= " + this.db.escape(ext_id)
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
          callback({
            code: 400,
            success: "false"
          })
        } else {
          // console.log(results)
          callback({
            code: 200,
            success: "true"
          })

          // deferred.resolve(results);
        }
      });
    }
  });
  console.log("update_industry_expert_details_p3 function finished")
  return deferred.promise;
}
Adapter.prototype.expertdetails = function(callback) {

  // const query = "SELECT * " +
  //   "FROM industry_expert_details "
  const query = "SELECT industry_expert_details.id as industry_expert_id, industry_expert_details.name as industry_expert_name, industry_expert_details.phone_number1, industry_expert_details.phone_number2, industry_expert_details.phone_number3,expert_industry.id as industry_id, expert_industry.name as industry_name FROM `industry_expert_details` INNER JOIN expert_industry ON industry_expert_details.industry_id = expert_industry.id"

  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
          callback({
            code: 400,
            result: err
          })
        } else {

          callback({
            code: 200,
            result: results
          })

          deferred.resolve(results);
        }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}
Adapter.prototype.industrydetails = function(callback) {

  const query = "SELECT * FROM expert_industry"

  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
          callback({
            code: 400,
            result: err
          })
        } else {

          callback({
            code: 200,
            result: results
          })

          deferred.resolve(results);
        }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}
Adapter.prototype.getRecordings = function(req, res) {

  const query = 'SELECT alexa_recordings.id as record_id, industry_expert_details.id as expert_id, industry_expert_details.name as expert_name, expert_industry.name as industry_name, alexa_recordings.call_sid, alexa_recordings.from_number, alexa_recordings.to_number, alexa_recordings.transcription, alexa_recordings.is_approved, alexa_recordings.sentiment_positivity, alexa_recordings.sentiment_negativity, alexa_recordings.sentiment_neutrality, alexa_recordings.label, CONCAT("https://api.twilio.com",REPLACE(alexa_recordings.uri,"json","mp3")) as uri FROM alexa_recordings INNER JOIN expert_industry ON alexa_recordings.industry = expert_industry.id INNER JOIN industry_expert_details ON alexa_recordings.industry_expert_id = industry_expert_details.id WHERE alexa_recordings.is_approved=' + this.db.escape(req.params.is_approved)

  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
          res.send({
            code: 400,
            result: err
          })
        } else {

          res.send({
            code: 200,
            result: results
          })

          deferred.resolve(results);
        }
      });
    }
  });
  console.log("getRecordings function finished")
  return deferred.promise;
}

Adapter.prototype.editApprovalStatus = function(req, res) {

  const query = 'UPDATE alexa_recordings SET is_approved = 1 WHERE id=' + this.db.escape(req.body.id)
  console.log('\n\n\n' + query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
          res.send({
            code: 400,
            result: err
          })
        } else {

          res.send({
            code: 200,
            result: results
          })

          deferred.resolve({
            code: 200,
            result: results
          });
        }
      });
    }
  });
  console.log("getRecordings function finished")
  return deferred.promise;
}

Adapter.prototype.editTranscription = function(req, res) {

  const query = 'UPDATE alexa_recordings SET transcription=' + this.db.escape(req.body.transcription) + ' WHERE id=' + this.db.escape(req.body.id)
  console.log('\n\n\n' + query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      console.log("conn successful")
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
          res.send({
            code: 400,
            result: err
          })
        } else {

          res.send({
            code: 200,
            result: results
          })

          deferred.resolve({
            code: 200,
            result: results
          });
        }
      });
    }
  });
  console.log("editTranscription function finished")
  return deferred.promise;
}

module.exports = Adapter;