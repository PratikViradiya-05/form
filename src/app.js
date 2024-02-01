// npm requires
const express = require("express")
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const hbs = require("hbs")
const schemaa = require("./models/schema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config();
const cookie = require("cookie-parser");
const auth = require("./middleware/auth")

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookie())

// connection file path
const conn = require("./db/conn");
const { register } = require("module");

// static file path
const spath = path.join(__dirname,"./public")

// for use static path
app.use(express.static(spath))

const linkss = path.join(__dirname,"./links")
app.use(express.static(linkss))

const valii = path.join(__dirname,"./vali")
app.use(express.static(valii));




// for use hbs files
const hbspath = path.join(__dirname , "../templates/views")
const ppath = path.join(__dirname , "../templates/partials")

app.set("view engine" , "hbs")
app.set("views" , hbspath)
hbs.registerPartials(ppath)



app.get("/" , (req,res) => {
    res.render("index");
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/registration" , (req,res)=>{
    res.render("registration")
})
app.get("/secret", auth ,(req,res)=>{
    console.log(`this is the cookie ${req.cookies.jwt}`);
    res.render("secret")
})
app.get("/logout" , auth ,async (req,res) => {
    try {

        // req.user.tokens = req.user.tokens.filter((current) => {
        //     return current.token !== req.token
        // })
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save();
        res.render("index")
    } catch (error) {
        res.status(401).send(error);
    }
})
app.post("/login", async (req,res)=>{
    try{
        const formdata = req.body;
        const register = new schemaa({
            fname : formdata.fname,
            mname : formdata.mname,
            lname : formdata.lname,
            gender : formdata.gender,
            dob : formdata.dob,
            email : formdata.email,
            phno : formdata.phno,
            password : formdata.password,
            password2 : formdata.password2
        })
        const ftoken = await register.createftoken();
        res.cookie("jwt" , ftoken , {
            expires : new Date(Date.now() + 3000000),
            httpOnly : true
        })

        const saved = await register.save();
        res.render("index")
    }catch(e){
        res.send(e)
    }
})
app.post("/registration" , async (req,res)=>{
    try {
        const logindata = req.body;
        const email = logindata.email;
        const password = logindata.password;
        const useremail = await schemaa.findOne({ email: email });
        const ismatch = await bcrypt.compare(password , useremail.password)
        const ftoken = await useremail.createftoken();
        res.cookie("jwt" , ftoken , {
            expires : new Date(Date.now() + 30000),
            httpOnly : true
        })

        if (ismatch) {
            res.render("index")
        } else {
            res.send("your password is invalid")
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})
app.listen(port , ()=>{
    console.log(`server from the app.js file port no ${port}`);
})