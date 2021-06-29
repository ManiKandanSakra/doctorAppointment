const mongoose = require('mongoose')
const Schema   = mongoose.Schema;

const SlotSchema = new Schema({
	'slotDate' :{type:String, index:true},
	'mrgSlot'  :{type:Array, default:[] },	
	'eveSlot'  :{type:Array, default:[] },
	'created_at' :{type:Date,default:Date.now }
})

module.exports = mongoose.model('slot',SlotSchema,'slot');