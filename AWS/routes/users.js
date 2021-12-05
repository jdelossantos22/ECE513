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
            zip:req.body.zip
         });

         //console.log("Got in")
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
            res.status(201).json({success:true, authToken: authToken, email:req.body.email});
         }
         else {
            res.status(401).json({success : false, message : "Invalid Email or password."});         
         }
         
      });
    }
  });
});
 






/*Auth token status*/
router.get("/status", function(req, res, next){
   //console.log(req.headers)
   //header should have X-Auth set
   if(!req.headers["x-auth"]){
      return res.status(401).json({error:"Missing X-Auth header"});
   }
   //X-auth should contain the token
   const token = req.headers["x-auth"];
   try{
      const decode = jwt.decode(token, secret);
      console.log(decode.email)
      User.find({email:decode.email}, function(err, users){
         if(err){
            res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
         }
         else {
            res.status(200).json(users);
         }
      });

   }
   catch(ex){
      res.status(401).json({error:"Invalid JWT"});
   }
});


//router to updated account info
router.put("/updateAccount", function(req, res, next){
   //console.log(req.headers)
   //header should have X-Auth set
   if(!req.headers["x-auth"]){
      return res.status(401).json({error:"Missing X-Auth header"});
   }
   //X-auth should contain the token
   const token = req.headers["x-auth"];

   try{
      const decode = jwt.decode(token, secret);
      console.log(decode.email)

      User.find({email:decode.email}, function(err, users){
         if(err){
            res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
         }
         else {
            user.findOneAndUpdate({email:decode.email},{$set:{email: req.body.email, fullName: req.body.fullName, zip: req.body.zip}}, function(err,user){
               if (err) {
                  return res.status(400).json(err);
               }
         else if (user){
            Device.update({userEmail:decode.email }, {$set:{deviceId:req.body.id}} ,{ multi: true }, function(err, status) {
               console.log("Device ID");
             });


         } 
         
         else {
            res.status(200).json(users);
         }
      });

   }
});
   }
   catch(ex){
      res.status(401).json({error:"Invalid JWT"});
   }
});




module.exports = router;
