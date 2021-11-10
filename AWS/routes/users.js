var express = require('express');
var router = express.Router();
let User = require("../models/users");
let Device = require("../models/device");
let Token = require("../models/token");

var crypto = require('crypto');
var nodemailer = require('nodemailer');
let fs = require('fs');
let bcrypt = require("bcryptjs");
let jwt = require("jwt-simple");

/*Check user*/
var user_already = fs.readFileSync(__dirname + '/../../jwtkey').toString();




/* Register */
router.post('/register', function(req, res, next) {

  if (!req.body.hasOwnProperty("email")){
    return res.status(400).json({success:false, message: "Email Required."})
  }
  if (!req.body.hasOwnProperty("fullName")){
    return res.status(400).json({success:false, message: "Full name Required."})
  }
  if (!req.body.hasOwnProperty("password")){
    return res.status(400).json({success:false, message: "Password Required."})
  }

  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {
       res.status(400).json({success : false, message : err.errmsg});
    }
    else {
      var newUser = new User ({
          email: req.body.email,
          fullName: req.body.fullName,
          passwordHash: hash,
          userDevices:[]
      });

      newUser.save(function(err, user) {
        if (err) {
           res.status(400).json({success : false, message : err.errmsg});
        }
        else {
          /*Create token*/
          var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

          /* Save token*/
          token.save(function (err) {
              if (err) {
                  console.log("Token was not saved" );
                  return res.status(500).send({ msg: err.message});
              }                

              var transporter = nodemailer.createTransport(smtpTransport({
                host: 'smtp.gmail.com',  
                service: "gmail",
              
                auth: {
                      user: "placeholder@gmail.com",
                      pass: "ECE513-SmartHome"
                  }
              }));
              var url =  'http://' + req.headers.host + '/users/confirmation/' + token.token;
              var mailOptions = {
                  from: 'placeholder@gmail.com', 
                  to: user.email, 
                  subject: 'Account Verification Token', 
                  text: 'Greetings,\n\n' + 'Verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/'+ '\/confirmation\/' + token.token + '.\n', 
                  html: "<b>Greetings,</b><br><br><p>Verify your account by clicking the link: " +  url  +" this link.</p>" 
              };

              transporter.sendMail(mailOptions, function(error, response){
                  if(error){
                      console.log(error);
                  }
                  else{
                
                      res.status(201).json({success : true, message : user.fullName + "Created"});
                  }
              });
          });
          
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
          res.status(401).json({success : false, message : " Invalid Email or password."});
      }
      else {
          bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
              if (err) {
                  res.status(401).json({success : false, message : "Error authenticating."});
              }
              else if(valid) { 

                  if (!user.verified) return res.status(401).send({success : false, message : 'Verify account' });

        
                  User.update({email: req.body.email}, {$set:{lastAccess:Date.now()}}, function(err, user) {
                    if (err){
                      res.status(400).json(err)
                    } else if (user){
                      var authToken = jwt.encode({email: req.body.email}, user_already);
                      res.status(201).json({success:true, authToken: authToken});
                    }
                    else {
                      res.status(400).json({success : false, message : "LastAccess was not set."})
                    }
                  })
              }
              else { 
                  res.status(401).json({success : false, message : "Invalid Email or password "});
              }
          });
      }
  });
});





module.exports = router;
