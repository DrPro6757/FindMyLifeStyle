const mongoose = require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect(process.env.MonogoDb_URL)
      const connection = mongoose.connection
      connection.on('connected',()=>{
        console.log("Connected to db")
      }) 
      connection.on('error',(error)=>{
        console.log('something went wrong ',error)
      })
    } catch (error) {
        console.log('something went wrong ',error)
    }
}

module.exports = connectDB
