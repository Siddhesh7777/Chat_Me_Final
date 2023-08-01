const mongoose = require('mongoose')

const connectDB =async  (url) => {
  try{
  await  mongoose.connect(url, {
    useNewUrlParser: true,
  })
  console.log('connected')
}
  catch(err){
    console.log('Connection failed');
  }
}


module.exports = connectDB
