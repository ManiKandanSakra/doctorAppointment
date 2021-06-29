var express = require('express');
var router = express.Router();
var ts=require("time-slots-generator");
var moment=require("moment");

// Collections
  const slotDetails  = require('../../collections/slotDetails');
// Collections


// Get Slot Timer
  router.get('/slotTimer', function(req, res, next) {
    var slotRes = ts.getTimeSlots([[30,510]],true,"half");
    // var slotRes = ts.getTimeSlots([],true, "half", false, false);
    // console.log('slotTimer -->',slotRes)
    var valueArray, keyArray;
    if(slotRes && typeof(slotRes) != "undefined"){
         valueArray = Object.values(slotRes);
         keyArray = Object.keys(slotRes);       
    }else{
     valueArray = [];
     keyArray  = [];
   }
    res.json({status:1,result:slotRes,valueArray:valueArray, keyArray:keyArray});
  });
// Get Slot Timer



// Create Slot
  router.post('/createSlot',function(req,res,next){
    try{
      let info = req.body;
      var date = info.date;
      var fromTime = info.fromTime;
      var toTime = info.toTime;
      var startTime = moment(fromTime, "HH:mm");
      var endTime = moment(toTime, "HH:mm");
      var Timediff = endTime.diff(startTime, 'minutes');
      if(Timediff == 30){
        var slotTime = moment(fromTime,'HH:mm').get('hours');
        var slotType, insData;
        if(slotTime >= 12){
          var where={'slotDate':date,"eveSlot":{'$elemMatch':{'fromTime':fromTime,'toTime': toTime}}}
          slotType = 'Evening';
        }else{
          var where={'slotDate':date,"mrgSlot":{'$elemMatch':{'fromTime':fromTime,'toTime': toTime}}}
          slotType = 'Morning';
        }
        console.log('where -->',where);
        slotDetails.find(where,(err,slotRes)=>{
          console.log('slotRes -->',slotRes)
          if(slotRes.length == 0){
            var slotArray       = [{'fromTime':fromTime,'toTime':toTime,'status': 'OUT','details':{}}];
            if(slotType == 'Morning'){
              insData = {
                slotDate:date,
                mrgSlot:slotArray,
              }
            }else{
              insData = {
                slotDate:date,
                eveSlot:slotArray,
              }
            }
            var select={'slotDate':date}
            slotDetails.find(select,(err,fetchRes)=>{
              if(fetchRes.length > 0){
                if(slotType == 'Morning'){
                  upData = {$push:{'mrgSlot':slotArray}}
                }else{
                  upData = {$push:{'eveSlot':slotArray}}
                }
                slotDetails.updateOne({'_id':fetchRes[0]._id},upData,(err,upRes)=>{
                  if(!err){
                    res.json({status:true,result:slotArray, msg:slotType+' Slot Created Successfully'});
                  }else{
                    res.json({status:false,result:[], msg:err});
                  }
                })
              }else{
                slotDetails.create(insData,(err,insRes)=>{
                  if(!err){
                    res.json({status:true,result:insRes, msg:slotType+' Slot Created Successfully',type:slotType});
                  }else{
                    res.json({status:false,result:[], msg:err});
                  }

                })
              }
            })
          }else{
            res.json({status:false,result:[], msg:'Slot Already Created'});
          }
        })
      }else{
        res.json({status:false,result:[], msg:'Invalid duration'});
      }
    }catch(e){
      res.json({status:false,result:[], msg:e});
    }
  })
// Create Slot

// Get Assigned Slot
  router.post('/getAssigned', function(req, res, next) {
    try{
      let info = req.body;
      var date = info.date
      slotDetails.find({'slotDate':date},(err,slotRes)=>{ 
      // slotDetails.find({'slotDate':date,$or:[{'mrgSlot.status':'IN'},{'eveSlot.status':'IN'}]},(err,slotRes)=>{ 
        if(!err){
          if(slotRes.length > 0){
            res.json({status:true,result:slotRes, msg:""})
          }else{
            res.json({status:false,result:[], msg:""})
          }
        }else{
          res.json({status:false,result:slotRes, msg:""})
        }
      })
    }catch(e){
      res.json({status:false,result:[],msg:e})
    }
  });
// Get Assigned Slot

module.exports = router;
