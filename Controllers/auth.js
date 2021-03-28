const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user')
const expressjwt = require('express-jwt')
const _ = require('lodash')


exports.signup = async (req,res) => {
    try{
        const userExists = await User.findOne({ email: req.body.email })
        if(userExists)
            return res.status(403).json({
                error: "Email is taken!"
            });
        const user = await new User(req.body)
        await user.save()
        res.status(200).json({ message: "Signup sucessfull please login" })
    }
    catch(error){
        console.log(`That did not go well: ${error}`);

    }

};

exports.signin = (req,res) => {
    //find the user based on email
    const {email,password} = req.body
    User.findOne({email},(err,user) =>  {
        //if err or no user
        if(err || !user) {
            return res.status(401).json({
                error: "User with that email not found.Please Signup"
            })
        }
        //if user found check email and password match
        //create authenticate method in model and use here 
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password do not match here"
            })

        }
        
        //generate a userid and secret
        const token = jwt.sign({_id: user._id}, process.env.jwt_secret);

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, {expire: new Date() + 9999});

        //return response with user and token to frontend client
        const {_id,name,email} = user
        return res.json({token, user: {_id,name,email} })


    })


};

exports.signout = (req,res) => {
    res.clearCookie("t");
    return res.json({ message: "Signout success!" });
}

exports.requireSignin = expressjwt({
    //if the token is valid ,express jwt appends the verified users id in an
    // auth key to the request object
    algorithms: ['HS256'],
    secret: process.env.jwt_secret,
    userProperty: "auth"


})
