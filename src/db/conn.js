const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/loginsystem",  {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
    // useCreateIndex:true
  }).then(()=>{
      console.log('Connection Successfull');
  }).catch((e)=>{
      console.log(e);
  });