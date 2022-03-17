const res = require("express/lib/response")
//importing jsonwebtoken
const jwt = require("jsonwebtoken")
//importing model from db
const db=require('./db')



database = {
  1000: { acno: 1000, uname: "NILA", password: "aaaa", balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "nimmi", password: "bbbb", balance: 5000, transaction: [] },
  1002: { acno: 1002, uname: "nithya", password: "cccc", balance: 5000, transaction: [] }

}



const register = (acno, uname, password) => {    //remember to give in the same order as in database...(in case of ts files convert it into arrow fnct)
 return db.User.findOne({acno})
 .then(user=>{console.log(user)
if(user){
  return {                                 //since reg called in reg comp.ts the value here should be returend to reg comp.ts
    statusCode: 422,       //statuscode 400series for showing error
     status: false,        //returning false
     message: "user already exist"
   }

}
else{
  const newUser=new db.User ({
    acno, uname, password,                 //to add the details entered by user in database db[key]={values in db}  Remember type in order
    balance: 0,
    transaction: []
  })
  newUser.save()
  return {
    statusCode: 200,
    status: true,
    message: "successfully registered"
  }

}
}
 
 )



  // let db = database                          //got the database defined above
  // if (acno in db) {
  //   return {                                 //since reg called in reg comp.ts the value here should be returend to reg comp.ts
  //    statusCode: 422,       //statuscode 400series for showing error
  //     status: false,        //returning false
  //     message: "user already exist"
  //   }

  // }
  // else {
  //   db[acno] = {
  //     acno, uname, password,                 //to add the details entered by user in database db[key]={values in db}  Remember type in order
  //     balance: 0,
  //     transaction: []
  //   }
  //   return {
  //     statusCode: 200,
  //     status: true,
  //     message: "successfully registered"
  //   }

  // }

}


const login = (acno, password) => {


  return db.User.findOne({acno,password})   //since key and value are same if diff should be defined as accno:acno,pswd:password
  .then(user=>{console.log(user)
  if(user){
    currentUname = user.uname  //to get username to display after welcome
    currentAcno = acno

    token = jwt.sign({       //since we have imported jsonwebtokren in jwt,need to call sign method from jwt
      currentAcc: acno     //just to knw that who has logged in
    }, "supersecretkey1234")  //secret will always be a string

    return {
      statusCode: 200,
      status: true,
      message: "LOGIN successfull", currentAcno,currentUname, token   //since currentcno,uname and token should be returned to client

    }

  }

  else{
    return {
      statusCode: 422,
      status: false,
      message: "invalid credentials"
    }

  }
})
  // let db = database
  // if (acno in db) {
  //   if (password == database[acno]["password"]) {
  //     currentUname = db[acno]["uname"]   //to get username to display after welcome
  //     currentAcno = acno

  //     token = jwt.sign({       //since we have imported jsonwebtokren in jwt,need to call sign method from jwt
  //       currentAcc: acno     //just to knw that who has logged in
  //     }, "supersecretkey1234")  //secret will always be a string

  //     return {
  //       statusCode: 200,
  //       status: true,
  //       message: "LOGIN successfull", currentAcno, currentUname, token   //since currentcno,uname and token should be returned to client

  //     }

  //   }
  //   else {
  //     return {
  //       statusCode: 422,
  //       status: false,
  //       message: "invalid password"
  //     }

  //   }

  // }
  // else {
  //   return {
  //     statusCode: 422,
  //     status: false,
  //     message: "invalid acccnum"

  //   }
  // }
}



const deposit = (acno, password, amt) => {
    var amount = parseInt(amt)         //to change from string

  return db.User.findOne({acno,password})
  .then(user=>{
    console.log(user)
    if(user){     user.balance += amount                   //to add up with balance
    user.transaction.push({    //to add the details of transactions in database
      amount: amount,
      type: "CREDIT"})
  user.save()
     return  {
  statusCode: 200,
  status: true,
  message: amount + "deposited ! New balance is" + user.balance}
            }

  else{
    return {
      statusCode: 422,
      status: false,
      message: "invalid credentials"}
      }
  })
  
  // var amount = parseInt(amt)         //to change from string
  // let db = database
  // if (acno in db) {
  //   if (password == db[acno]["password"]) {
  //     db[acno]["balance"] += amount                   //to add up with balance
  //     db[acno].transaction.push({    //to add the details of transactions in database
  //       amount: amount,
  //       type: "CREDIT"
  //     })
  //     return 
  //     {
  //       statusCode: 200,
  //       status: true,
  //       message: amount + "deposited ! New balance is" + db[acno]["balance"]
  //     }
  //   }
  //   else {
  //     return {
  //       statusCode: 422,
  //       status: false,
  //       message: "invalid password"

  //     }
  //   }
  // }
  // else {
  //   return {
  //     statusCode: 422,
  //     status: false,
  //     message: "invalid account number"

  //   }
  // }
}

const withdraw = (req, acno, password, amt) => {    //account_num, pass_word, amount_value
  var amount = parseInt(amt)
  currentAcc = req.currentAcc

return db.User.findOne({acno,password})
.then (user=>{
  console.log(user)
  
    if(currentAcc != acno){
      return {
        statusCode: 422,
        status: false,
        message: "operation denied"

      }   
    }
    if(user){
      if(user.balance>acno){
               user.balance -= amount
        user.transaction.push({
          amount: amount,
          type: "DEBIT"})
          user.save()
                  return {
          statusCode: 200,
          status: true,
          message: amount + "debited ! New balance is" + user.balance
        }

    }
    else{
      return {
        statusCode: 422,
        status: false,
        message: "insufficient balance"}
       }
  
}
else{
  return {
    statusCode: 422,
    status: false,
    message: "invalid credentials"}
    }

}
)}


  // let db = database
  // if (account_num in db) {

  //   if (pass_word == db[account_num]["password"]) {

  //     if (currentAcc != account_num) {
  //       return {
  //         statusCode: 422,
  //         status: false,
  //         message: "operation denied"

  //       }

  //     }

  //     if (db[account_num]["balance"] > amount_value) {
  //       db[account_num]["balance"] -= amount
  //       db[account_num].transaction.push({
  //         amount: amount,
  //         type: "DEBIT"
  //       })

  //       return {
  //         statusCode: 200,
  //         status: true,
  //         message: amount + "deposited ! New balance is" + db[account_num]["balance"]
  //       }

  //     }
  //     else {
  //     }
  //   }
  //   else {
  //     return {
  //       statusCode: 422,
  //       status: false,
  //       message: "invalid password"

  //     }

  //   }
  // }
  // else {
  //   return {
  //     statusCode: 422,
  //     status: false,
  //     message: "invalid account number"
  //   }
  // }




//get transaction array
const getTransaction=(acno)=> {
  return db.User.findOne({acno})
  .then(user=>{
    if(user){
      return {
        statusCode: 200,
        status: true,
        transaction: user.transaction
      }
  
    }
    else{
      return {
        statusCode: 422,
        status: false,
        message: "invalid account number"
      }
  
    }

  })
//   if (acno in database) {
//     return {
//       statusCode: 200,
//       status: true,
//       transaction: database[acno].transaction
//     }

//   }
//   else {
//     return {
//       statusCode: 422,
//       status: false,
//       message: "invalid account number"
//     }
//   }
}

const deleteAcc=(acno)=>{
  return db.User.deleteOne({
    acno
  })
  .then(user=>{
    if(user){
      return {
        statusCode: 200,
        status: true,
       message:"Account deleted successfully"
      }

    }
    else{
      return{
        statusCode: 422,
        status: false,
        message: "invalid credentials"

      }
    }
  })
}





module.exports = { register, login, deposit, withdraw, getTransaction, deleteAcc }