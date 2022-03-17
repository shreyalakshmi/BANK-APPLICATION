//import express
const express = require('express');
const res = require('express/lib/response');
const jwt= require('jsonwebtoken');
const cors= require('cors')


//to get register fntc from dataservices
const dataservices = require('./services/data.services')

//create an app using express
const app =  express()

//to use cors to set origin(should be defined after app cz need to use inside app)
app.use(cors({
    origin:'http://localhost:4200'
}))


    //MIDDLEWARE(APPLICATION SPECIFIC)
    //to check if the user is logined, otherwise no permission to depo,with etc
    const logMiddleware=(req,res,next)=>{
        console.log("APP MIDDLEWARE");
        next()
    }
    //to use middle ware in our application
    app.use(logMiddleware)


    
// to json parse
app.use(express.json())

// //to resolve http req
app.get('/',(req,res)=>{
    res.send("get method")
});

//post for creating data
app.post('/',(req,res)=>{
    res.send("post method")
});

//put for updating or modifing the data
app.put('/',(req,res)=>{
    res.send("put method")
});

//patch for partially modifying the data
app.delete('/',(req,res)=>{
    res.send("delete method")
});


//delete for deletig the data
app.patch('/',(req,res)=>{
    res.send("patch method")
});

                                             //bank app server side


const jwtMiddleware = (req,res,next)=>{       //to verify token produced by logined person
    try{const token=req.headers["x-access-token"]
    console.log(jwt.verify(token,'supersecretkey1234'));
    const data = jwt.verify(token,'supersecretkey1234')
req.currentAcc = data.currentAcc
next()}
catch{
    res.status(422).json({statusCode:422,
    status:false,
    message:"please login!"})

}
}


app.post('/register',(req,res)=>{
    // console.log(req.body.acno);

    dataservices.register(req.body.acno,req.body.uname,req.body.password)
    .then(result=>{                               //.then bcs it is asynchronus and to resolve it
        res.status(result.statusCode).json(result)})

})     


app.post('/login',(req,res)=>{
dataservices.login(req.body.acno,req.body.password)
.then(result=>{
    res.status(result.statusCode).json(result)})
     
})

app.post('/deposit',jwtMiddleware,(req,res)=>{    //jwtmiddlleware is router specific middleware used only when clients call specific funtn,deposit
     dataservices.deposit(req.body.acno,req.body.password,req.body.amt)
     .then(result=>{
        res.status(result.statusCode).json(result)})

})

app.post('/withdraw',jwtMiddleware,
(req,res)=>{
     dataservices.withdraw(req,req.body.acno,req.body.password,req.body.amt)
     .then(result=>{
        res.status(result.statusCode).json(result)

     })

})
 //transaction API
app.post('/getTransaction',jwtMiddleware,(req,res)=>{
     dataservices.getTransaction(req.body.acno)
     .then(result=>{
        res.status(result.statusCode).json(result)

     })

})

app.delete('/deleteAcc/:acno',(req,res)=>{
    dataservices.deleteAcc(req.params.acno)  //acno consists in a parameter therefore params
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})





//to set port no of server
app.listen(3001,()=>{
    console.log("server port 3001");
})


