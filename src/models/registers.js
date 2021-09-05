const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    fisrtname:{
        type: String,
        // required:true
        required:true
    },
    lastname:{
        type: String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pass:{
        type:String,
        required:true,      
    },
    tokens:[{
        token:{

            type:String,
            unique:true
        }
    }]
});


userSchema.methods.generateAuthtoken = async function(){
    try {
    const token =  await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY); 
    // console.log("Tocken " +tocken);    
    // console.log("id " +this._id.toString());
    this.tokens = this.tokens.concat({token :token})


    await this.save();  
    return token;
} catch (error) {
        // res.send(error);
        console.log("erro :"+error);
    }
}


userSchema.pre("save",async function(next){
    if (this.isModified("pass")) {
        
        // const passHas = await bcrypt.hash(pass,10);
        // console.log(`the current passs : ${this.pass}`);
        this.pass = await bcrypt.hash(this.pass,10);
    }
    next();
});;

const register = new mongoose.model("User",userSchema);
// console.log("Dipak");
module.exports = register;
// module.exports = mongoose.model('Resource', ResourceSchema);  