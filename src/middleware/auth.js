const jwt = require("jsonwebtoken");
const schem = require("../models/schema");

const auth = async (req,res,next) => {
    try {
        const  token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, process.env.secret)
        const user = await schem.findOne({_id : verifyuser._id})
        // console.log(verifyuser);
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}
module.exports = auth;