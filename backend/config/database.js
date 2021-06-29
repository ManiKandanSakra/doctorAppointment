//Databse connection
const mongoose =require('mongoose')
var CryptoJS = require("crypto-js");

var ciphertext = 'U2FsdGVkX19LobvUnDIkhEHJ+WDMxh4Eb59VdWB561f+1GQKUaq25ykClNDuD+3NHZ49g5NJi6KbsRu1b9CBUBJYDJaMufIHOUVsXd7hYYumdO46QeFu4+s/VT8x4ry61O9p0XlhB9HUHIPcMOltimjrWu0Q5nUL9CmB6WkpRrA=';

var bytes  = CryptoJS.AES.decrypt(ciphertext, 'HniRbjKt$456)jhkh');
var originalText = bytes.toString(CryptoJS.enc.Utf8);


mongoose.set('useCreateIndex',true)
function connectDB(){
  mongoose.connect(originalText,{ useNewUrlParser: true, useUnifiedTopology: true,keepAlive:true }).then(()=>{
  console.log("Database connection Successfully")
  }).catch((err)=>{ 
    console.log("Database connection Failed",err)
  }); 
}

connectDB();

mongoose.connection.on('disconnected',()=>{
  console.log('Database disconnected')
  connectDB()
})

//Databse connection