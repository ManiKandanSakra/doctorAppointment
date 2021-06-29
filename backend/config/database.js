//Databse connection
const mongoose =require('mongoose')
mongoose.set('useCreateIndex',true)

mongoose.set('useCreateIndex',true)

function connection(){
  mongoose.connect('mongodb+srv://mani:Mani@123@cluster0.kesa7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true,keepAlive:true }).then(()=>{
  console.log("DB connected")
  }).catch((err)=>{ 
    console.log("DB connected Failed",err)
  }); 
}

connection();

mongoose.connection.on('disconnected',()=>{
  console.log('DB disconnected at',new Date())
  connection()
})

//Databse connection