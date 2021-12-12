var express = require('express');
var router = express.Router();
let Temperature = require("../models/temperature")


//create
router.post('/create', function(req, res){
    console.log(req.body.postDate)
    let date = new Date(req.body.postDate)
    console.log(req.body.email)
    Temperature.findOne({postDate: date, deviceId:req.body.id, userEmail:req.body.email}, function(err, temp){
        if(err) res.status(401).json({success:false, err:err});
        else if(temp){
            res.status(401).json({success:false, msg:"The data for this date already saved"});
        }
        else{
            const newTemp = new Temperature({
                deviceId:req.body.id,
                userEmail:req.body.email,
                postDate:date,
                temperature: req.body.temperature,
                humidity:req.body.humidity,
                power:req.body.power
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
    Temperature.find({postDate:req.body.date}, function(err, temp){
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
    
    let today = new Date(req.body.date);
    
    //today = today.setHours(0,0,0,0);
    //console.log()
    console.log(`COMPARE: ${Date.now()}`)
    console.log(`HERE: ${today}`);
    //console.log(day)
    let tomorrow = req.body.date + day;
    tomorrow = new Date(tomorrow)
    //tomorrow = tomorrow.setHours(0,0,0,0);
    console.log(`HERE: ${tomorrow}`);
    //console.log(today)
    //console.log(tomorrow)
    //{date:{$gt: Date(today), $lt:Date(tomorrow)}}
    //console.log(req.body.id)
    today = new Date(today)
    tomorrow = new Date(tomorrow)
    console.log(new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0).toISOString())
    console.log(new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0).toISOString())
    //, $lt: Date(tomorrow)}
    Temperature.find({postDate:{$gte: new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0).toISOString(), $lt: new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0).toISOString()}, deviceId:req.body.id, userEmail:req.body.email}).sort({postDate:1}).exec(function(err, docs){
        if(err){
            let msg = `Can't find information on date ...`;
            res.status(201).json({msg:msg});
        }
        else{
            console.log(docs)
            res.status(201).json(docs);
        }
    });
});

module.exports = router;