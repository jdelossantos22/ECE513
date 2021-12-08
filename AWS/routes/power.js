var express = require('express');
var router = express.Router();
let Power = require("../models/temperature")

//create
router.post('/create', function(req, res){
    console.log(req.body.postDate)
    let date = new Date(req.body.postDate)
    Power.findOne({postDate: date, deviceId: req.body.id}, function(err, temp){
        if(err) res.status(401).json({success:false, err:err});
        else if(temp){
            res.status(401).json({success:false, msg:"The data for this date already saved"});
        }
        else{
            const newPower = new Power({
                deviceId:req.body.id,
                postDate:date,
                power:req.body.power
            })
            newPower.save(function(err, pow){
                if(err){
                    console.log(err)
                    res.status(400).json({success:false, err:err});
                }
                else{
                    res.status(201).json({success: true, msg: "Power saved"})
                }
            });
        }
    });
});

//find-use params
router.post('/find', function(req,res){
    Power.find({date:req.body.date, deviceId:req.body.id}, function(err, temp){
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
    let day = 1000 * 60 * 60 * 24 * 7;
    let today = req.body.date;
    
    //today = today.setHours(0,0,0,0);
    
    let nextWeek = today + day
    //console.log(today)
    //console.log(tomorrow)
    //{date:{$gt: Date(today), $lt:Date(tomorrow)}}
    //{postDate:{$gte: today, $lt:nextWeek}}
    Power.find({postDate:{$gte: today, $lte:nextWeek}}, function(err, docs){
        if(err){
            let msg = `Something wrong with power readAll ...`;
            res.status(201).json({msg:msg});
        }
        else{
            console.log(docs)
            res.status(201).json(docs);
        }
    });
});

router.post('/dailySum', function(req, res, next){
    Power.find({postDate:{$gt: Date(today), $lt:Date(tomorrow)}, deviceId:req.body.id}, function(err, power){
        Power.aggregate([
        {
           $project:
             {
               year: { $year: "$postDate" },
               month: { $month: "$postDate" },
               day: { $dayOfMonth: "$postDate" },
               _id: "$id",
               value: "$power"
             }
        },
        {
           $group:
             {
               year: "$year",
               month: "$month",
                   day: "$day",
                   sumValue: { $sum: "$value" } 
                 }
            }
        ], function(err, docs){
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
});

router.post('/weekAvg', function(req, res, next){
    Power.aggregate([
        {
           $project:
             {
               year: { $year: "$postDate" },
               week: { $week: "$postDate" },
               _id: "$id",
               value: "$power"
             }
        },
        {
           $group:
             {
               year: "$year",
               month: "$month",
                   week: "$week",
                   avgValue: { $avg: "$value" } 
                 }
            }
        ], function(err, docs){
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