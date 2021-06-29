var express = require('express');
var router = express.Router();
var ts=require("time-slots-generator");
var moment=require("moment");
var validator = require('validator');
// var randomInt=require("random-int");
// var Rnum = randomInt(100, 999);
// console.log('Rnum -->',Rnum)

// Collections
  const slotDetails  = require('../../collections/slotDetails');
// Collections


// Create Appoinment
  router.post('/createAppointment',function(req,res,next){
    try{
      let info = req.body;
      var date = info.date;
      var fromTime = info.fromTime;
      var toTime = info.toTime;
      var username = info.username;
      var contact = info.contact;
      var toTime = info.toTime;
      if(validator.isEmpty(fromTime) == true || validator.isEmpty(toTime) == true || validator.isEmpty(date) == true){
        res.json({status:false,result:[], msg:'Kindly Fill Your Valid Duration/Date'});
        return;
      }
      if(validator.isEmpty(username) == true || validator.isEmpty(contact) == true || validator.isEmpty(toTime) == true){
        res.json({status:false,result:[], msg:'Kindly Fill Your Information'});
        return;
      }
      var startTime = moment(fromTime, "HH:mm");
      var endTime = moment(toTime, "HH:mm");
      var Timediff = endTime.diff(startTime, 'minutes');
      if(Timediff == 30){
        var slotTime = moment(fromTime,'HH:mm').get('hours');
        var slotType, insData;
        if(slotTime >= 12){
          var where={'slotDate':date,"eveSlot":{'$elemMatch':{'fromTime':fromTime,'toTime': toTime,'status':'OUT'}}}
          slotType = 'Evening';
        }else{
          var where={'slotDate':date,"mrgSlot":{'$elemMatch':{'fromTime':fromTime,'toTime': toTime,status:'OUT'}}}
          slotType = 'Morning';
        }
        console.log('where -->',where);
        slotDetails.find(where,(err,slotRes)=>{
        // console.log('where err -->',err);
          // console.log('slotRes -->',slotRes)
          if(slotRes.length > 0){
            var slotNum = (Math.floor(Math.random() * 100) + 1);
            var slotArray  = {'fromTime':fromTime,'toTime': toTime,'username':username,'contact':contact,'slotNum':'SLOT-'+ slotNum};
            // console.log('slotArray -->',slotArray)
            if(slotType == 'Morning'){
              upData = {$set:{'mrgSlot.$.status':"IN",'mrgSlot.$.details':slotArray}}
            }else{
              upData = {$set:{'eveSlot.$.status':"IN",'eveSlot.$.details':slotArray}}
            }
            // console.log('upData -->',upData);
            slotDetails.updateOne(where,upData,(err,upRes)=>{
              // console.log('upRes err -->',err);
              // console.log('upRes -->',upRes);
              if(!err){
                res.json({status:true,slot:slotNum, msg:slotType+' Slot Allocated, Kindly Note Your Slot Number'});
              }else{
                res.json({status:false,result:[], msg:err});
              }
            })
          }else{
            res.json({status:false,result:[], msg:'Slot Not Avilable'});
          }
        })
      }else{
        res.json({status:false,result:[], msg:'Invalid duration'});
      }
    }catch(e){
      res.json({status:false,result:[], msg:e});
    }
  })
// Create Appointment


module.exports = router;
