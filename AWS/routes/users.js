var express = require('express');
var router = express.Router();
let User = require("../models/users");
let Device = require("../models/device");
let Token = require("../models/token");

var crypto = require('crypto');
var nodemailer = require('nodemailer');
const fs = require('fs');
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");

/*Check user*/
const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();
//const secret = "supersecret";

/* Register */
router.post('/register', function(req, res) {
   
   User.findOne({email: req.body.email}, function(err, user){
      if(err) res.status(401).json({success:false, err:err});
      else if(user){
         res.status(401).json({success: false, msg: "This email already used" });
      }
      else{
         const passwordHash = bcrypt.hashSync(req.body.password,10);
         const newUser = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: passwordHash,
            userDevices:[],
            zip:-1
         });

         console.log("Got in")
         newUser.save(function (err,customer){
            if(err){
               console.log(err)
               res.status(400).json({success: false, err: err});
               
            }
            else{
               res.status(201).json({success : true, message : req.body.fullName + "has been created"});
               console.log("user created")
            }
         });
      }

   });
 });

/*Signin*/
router.post('/signin', function(req, res, next) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
       res.status(401).json({success : false, message : "Can't connect."});         
    }
    else if(!user) {
       res.status(401).json({success : false, message : "Invalid Email or password ."});         
    }
    else {
      bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
         if (err) {
           res.status(401).json({success : false, message : "Error authenticating."});         
         }
         else if(valid) {
            var authToken = jwt.encode({email: req.body.email}, secret);
            res.status(201).json({success:true, authToken: authToken});
         }
         else {
            res.status(401).json({success : false, message : "Invalid Email or password."});         
         }
         
      });
    }
  });
});
 






/*Zip COde*/

router.get("/status", function(req, res, next){
  var valid_zip = /^\d{5}$/;

  if (!valid_zip.test(req.query.zip)) {
          var errormsg = {"error" : "a zip code is required"};
          res.status(400).send(JSON.stringify(errormsg));
  }
  else {
          var zipID = req.query.zip;
          var query = {"zip":zipID};
          Recording.find(query, function(err, allzipcodes){
                  if(err){
                          var errormsg = { "message" : err};
                          res.status(400).send(JSON.stringify(errormsg));
                  }
          });
  }
});


router.post("/register", function(req, res, next) {
   if (!req.body.hasOwnProperty("zip")){
      var errormsg = {"error" : "zip required"};
      res.status(400).send(JSON.stringify(errormsg));
      }
   var newZipcode = new Recording ( {
      zip: req.body.zip,
      });
   newZipcode.save(function(err, newZipcode){
   if (err) {
      var errormessage = {"error" : "zip required."};
      res.status(400).json(errormessage);
      }
   else	{
      var msg = {"response" : "Data recorded."}
      res.status(201).json(msg);
      }
   });
});






module.exports = router;
