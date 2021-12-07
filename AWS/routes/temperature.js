var express = require('express');
var router = express.Router();
let Temperature = require("../models/temperature")


//create
router.post('/create', function(req, res){
    console.log(req.body.postDate)
    let date = new Date(req.body.postDate)
    Temperature.findOne({postDate: date, deviceId:req.body.id}, function(err, temp){
        if(err) res.status(401).json({success:false, err:err});
        else if(temp){
            res.status(401).json({success:false, msg:"The data for this date already saved"});
        }
        else{
            const newTemp = new Temperature({
                deviceId:req.body.id,
                postDate:date,
                temperature: req.body.temperature,
                humidity:req.body.humidity
            })
            newTemp.save(function(err, temp){
                if(err){
                    console.log(err)
                    res.status(400).json({success:false, err:err});
                }
                else{
                    res.status(201).json({success: true, msg: "Temperature and Humidity saved"})
                }
            });
        }
    });
});

//find-use params
router.post('/find', function(req,res){
    Temperature.find({date:req.body.date}, function(err, temp){
        if(err){
            let msg = `Something wrong with device find ...`;
            res.status(201).json({msg:msg});
        }
        else{
            res.status(201).json(temp);
        }
    })
});

//readAll
router.post('/readAll', function(req,res,next){
    let day = 1000 * 60 * 60 * 24;
    let today = req.body.date;
    
    //today = today.setHours(0,0,0,0);
    
    let tomorrow = req.body.date + day
    //console.log(today)
    //console.log(tomorrow)
    //{date:{$gt: Date(today), $lt:Date(tomorrow)}}
    Temperature.find({date:{$gt: Date(today), $lt:Date(tomorrow)}}, function(err, docs){
        if(err){
            let msg = `Something wrong with device find ...`;
            res.status(201).json({msg:msg});
        }
        else{
            console.log(docs)
            res.status(201).json(docs);
        }
    });
});

module.exports = router;