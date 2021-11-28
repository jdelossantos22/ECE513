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
   
    Device.findOne({userEmail: req.body.email}, function(err, user){
       if(err) res.status(401).json({success:false, err:err});
       else if(user){
          res.status(401).json({success: false, msg: "This email already used" });
       }
       else{
          const newDevice = new Device({
            apikey:       req.body.api,
            deviceId:     req.body.id,
            userEmail:    req.body.email,
            deviceName: req.body.name
          });
 
          //console.log("Got in")
          newDevice.save(function (err, device){
             if(err){
                console.log(err)
                res.status(400).json({success: false, err: err});
                
             }
             else{
                res.status(201).json({success : true, message : req.body.name + "has been added to " + req.body.email});
                console.log("device created")
             }
          });
       }
 
    });
  });

router.post('/find', function(req, res){
    Device.findOne({userEmail: req.body.email}, function(err, device){
        if(device){
            res.status(200).json({success: true, msg: "User already has device" });
        }
        else{
            res.status(201).json({success: true, msg: "This user has no device" });
        }
    });
});

module.exports = router;