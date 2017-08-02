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

  const query = "SELECT * " +
    "FROM alexa_recordings " +
    "WHERE call_sid = " + this.db.escape(sid);
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
Adapter.prototype.getTransdetails = function(rsid, callback) {

  const query = "SELECT * " +
    "FROM alexa_transcriptions " +
    "WHERE rsid = " + this.db.escape(rsid);
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

Adapter.prototype.insert = function(industry, call_sid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label, callback) {

  console.log("-----------===", industry, call_sid, from_number, to_number, uri, transcription, positivity, negativity, neutrality, label)

  const query = "INSERT INTO alexa_recordings(industry,call_sid,from_number,to_number,uri,transcription,sentiment_positivity,sentiment_negitivity,sentiment_nutrality,label)" +
    "VALUES( " + this.db.escape(industry) + "," + this.db.escape(call_sid) + "," + this.db.escape(from_number) + "," + this.db.escape(to_number) + "," + this.db.escape(uri) + "," + this.db.escape(transcription) + "," + this.db.escape(positivity) + "," + this.db.escape(negativity) + "," + this.db.escape(neutrality) + "," + this.db.escape(label) + ")";
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
          // console.log(results)
          callback(results)
            // deferred.resolve(results);
        }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}
Adapter.prototype.insertDetails = function(industry, call_sid, from_number, to_number, callback) {
  console.log(industry, call_sid, from_number, to_number)
    // return true;


  const query = "INSERT INTO alexa_recordings(industry,call_sid,from_number,to_number)" +
    "VALUES( " + this.db.escape(industry) + "," + this.db.escape(call_sid) + "," + this.db.escape(from_number) + "," + this.db.escape(to_number) + ")";
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
          // console.log(results)
          callback(results)
            // deferred.resolve(results);
        }
      });
    }
  });
  console.log("getBotUser function finished")
  return deferred.promise;
}
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

  const query = 'UPDATE alexa_transcriptions SET transcription=' + this.db.escape(tran_text) + ' WHERE rsid=' + this.db.escape(rsid) + ';'
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
Adapter.prototype.inserttranscriptions = function(rsid, trans_text, callback) {



    const query = "INSERT INTO alexa_transcriptions(rsid,transcription)" +
      "VALUES( " + this.db.escape(rsid) + "," + this.db.escape(trans_text) + ")";
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
            // console.log(results)
            callback(results)
              // deferred.resolve(results);
          }
        });
      }
    });
    console.log("getBotUser function finished")
    return deferred.promise;
  }
  //    Adapter.prototype.updatesentiment = function(pos,neg,label,rsid,callback) {
  // const query = 'UPDATE alexa_recordings SET sentiment_positivity='+ this.db.escape(pos) +',sentiment_negitivity='+ this.db.escape(neg) +',label='+ this.db.escape(label) +' WHERE rsid=' +  this.db.escape(rsid)  + ';'
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

  const query = 'UPDATE alexa_recordings SET sentiment_positivity=' + this.db.escape(pos) + ',sentiment_negitivity=' + this.db.escape(neg) + ',label=' + this.db.escape(label) + ' WHERE rsid=' + this.db.escape(rsid) + ';'
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

Adapter.prototype.insert_industry_expert_details = function(name, industry, phone_number1, callback) {



  const query = "INSERT INTO industry_expert_details(name,industry,phone_number1)" +
    "VALUES( " + this.db.escape(name) + "," + this.db.escape(industry) + "," + this.db.escape(phone_number1) + ")";
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

  // return true;



  // const query = "INSERT INTO industry_expert_details(name,industry,phone_number1,phone_number2)" +
  //   "VALUES( " + this.db.escape(name) + "," + this.db.escape(industry) + "," + this.db.escape(phone_number1) + "," + this.db.escape(phone_number2) + ")";
  const query = "INSERT INTO industry_expert_details(name,industry_id,phone_number1,phone_number2)" +
    "VALUES( " + this.db.escape(name) + "," + this.db.escape(industry_id) + "," + this.db.escape(phone_number1) + "," + this.db.escape(phone_number2) +")";
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
  console.log("getBotUser function finished")
  return deferred.promise;
}
Adapter.prototype.update_industry_expert_details = function(ext_id, name, industry, phone_number1, callback) {



  const query = "UPDATE industry_expert_details SET name=" + this.db.escape(name) + ",industry=" + this.db.escape(industry) + ",phone_number1=" + this.db.escape(phone_number1) + ",phone_number2=" + this.db.escape(null) + ",phone_number3=" + this.db.escape(null) + " WHERE id= " + this.db.escape(ext_id)

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
Adapter.prototype.update_industry_expert_details_p2 = function(ext_id, name, industry, phone_number1, phone_number2, callback) {
  const query = "UPDATE industry_expert_details SET name=" + this.db.escape(name) + ",industry=" + this.db.escape(industry) + ",phone_number1=" + this.db.escape(phone_number1) + ",phone_number2=" + this.db.escape(phone_number2) + ",phone_number3=" + this.db.escape("") + " WHERE id= " + this.db.escape(ext_id)
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
  console.log("getBotUser function finished")
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
module.exports = Adapter;