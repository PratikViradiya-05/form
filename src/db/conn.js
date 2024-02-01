const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/registration-form").then(()=>{
    console.log("connection successfully from conn.js file");
}).catch((e)=>{
    console.log("error from conn.js file");
})