const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const schema = mongoose.Schema({
    fname : {
        type : String,
        required : true
    },
    mname : {
        type : String
    },
    lname : {
        type : String
    },
    gender : {
        type : String,
        required : true
    },
    dob : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    phno : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    password2 : {
        type : String,
        required : true
    },
    tokens : [{
        token :{
            type : String,
            required : true
        }
    }]
    
})
schema.methods.createftoken = async function(){
    try {
        const token = jwt.sign({_id : this._id.toString()},process.env.secret)
        // console.log(token);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (e) {
        console.log("error from the jwt token");
    }
}
 schema.pre("save",async function (next) { 
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.password2 = await bcrypt.hash(this.password,10);;
    }
    next();
  })

const schemaa = new mongoose.model("ragistrationform",schema);
module.exports = schemaa;