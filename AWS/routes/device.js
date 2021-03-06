var express = require('express');
var router = express.Router();
let Device = require("../models/device");

/* //add */
router.post('/create', function(req, res) {
    console.log(req.body)
    Device.findOne({deviceId: req.body.id, userEmail:req.body.email}, function(err, user){
       if(err) res.status(401).json({success:false, err:err});
       else if(user){
          res.status(401).json({success: false, msg: "This device id already created" });
       }
       else{

          const newDevice = new Device({
            apikey:       req.body.api,
            deviceId:     req.body.id,
            userEmail:    req.body.email,
            deviceName: req.body.name,
            startDate: req.body.startDate
          });
 
          //console.log("Got in")
          newDevice.save(function (err, device){
             if(err){
                console.log(err)
                res.status(400).json({success: false, err: err});
                
             }
             else{
                res.status(201).json({success : true, message : req.body.name + "has been added to " + req.body.email, dKey:device.apikey, dId:device.deviceId});
                console.log("device created")
             }
          });
       }
 
    });
  });


router.post('/find', function(req, res){
    Device.findOne({userEmail: req.body.email}, function(err, device){
        if(device){
            res.status(200).json({success: true, msg: "User already has device", dKey: device.apikey, dId:device.deviceId}); //, authToken: authToken, email:req.body.email
        }
        else{
            res.status(201).json({success: true, msg: "This user has no device" });
        }
    });
});
//findAll
router.post('/findAll', function(req, res){
    Device.find({userEmail: req.body.email}).sort({"_id":1}).exec(function(err, devices){
      if(devices){
          res.status(200).json({success: true, msg: "User already has device", devices:devices}); //, authToken: authToken, email:req.body.email
      }
      else{
          res.status(201).json({success: true, msg: "This user has no device" });
      }
  });
});

//remove
router.post('/delete', function(req,res){
   Device.deleteOne({deviceId:req.body.id}, function(err, result){
      if(err){
         let msg = "Delete err";
         res.status(201).json({msg:msg, err:err});
      }
      else{
         let msg = result;
         res.status(201).json({msg:msg});
      }
   });
});




//update
router.post('/update', function(req, res){
   Device.findOneAndUpdate({deviceId:req.body.deviceId}, req.body, function(err,doc){
      if(err){
         let msg = 'Something wrong with update ...'
         res.status(201).json({msg:msg, err:err});
      }
      else{
         let msg;
         if(doc == null){
            msg = `Device (name: ${req.body.name}) info does not exist in DB`;
         }
         else{
            msg = `Device (name: ${req.body.name}) has been updated`;
         }
         res.status(201).json({msg:msg});
      }
   });
});

module.exports = router;