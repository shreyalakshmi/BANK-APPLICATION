//first import mongoose

const mongoose=require('mongoose')

//create a link to connect server with db
mongoose.connect('mongodb://localhost:27017/bankApp',{useNewUrlParser:true})


//creating a model for what data we expect
const User=mongoose.model('User',{
     acno: Number,
      uname: String,
       password: String,
        balance: Number,
         transaction: [] 

})

//exporting model to import it in dataservices
module.exports={User}



