const Post = require('../models/notes')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.postById = (req,res,next,id) => {
    Post.findById(id)
    .populate("postedBy","_id name")
    .select("_id title body created")
    .exec((err,post) => {
        if(err || !post) {
            return res.status(400).json({
                error: err
            })
        }
        req.post = post
        next()
    })
}

exports.getPosts = (req,res) => {
    const posts = Post.find()
    .populate("postedBy","_id name")
    .select("_id title body created updated").sort({created: -1})
    .then((posts) => {
        res.json(posts);
    })
    .catch(err => console.log(err));
};

exports.createPost = (req,res,next) => {
    console.log(req.body)
    let post = new Post(req.body);
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined
    post.postedBy = req.profile;
    post.save((err,result)=>{
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(result)
    })
};

exports.postsByUser = (req,res) => {
    Post.find({postedBy: req.profile._id})
        .populate("postedBy","_id name")
        .select("_id title body created likes")
        .sort("_created")
        .exec((err,posts) =>{
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(posts)
        })
};

exports.isPoster = (req,res,next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if(!isPoster) {
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next();
};


exports.updatePost = (req,res,next) => {
    console.log(req.body)
    let post = req.post
    post = _.extend(post, req.body)
    post.updated = Date.now()
    post.save((err,result) => {
        if(err) {
                return res.status(400).json({
                error:err
            })
         }
        res.json(post) 
    })
}

exports.singlePost = (req,res,next) => {
    return res.json(req.post)
}

exports.deletePost = (req,res) => {
    let post = req.post
    post.remove((err,post)=> {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: "Message deleted successfully"
        })
    })
};