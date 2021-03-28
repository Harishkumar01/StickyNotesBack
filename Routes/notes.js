const express = require('express')
const {getPosts,createPost,postsByUser,postById,updatePost,deletePost, singlePost} = require('../Controllers/notes')
const { requireSignin } = require('../Controllers/auth')
const { userById } = require('../Controllers/user')

const router = express.Router();

router.get('/posts', getPosts);
router.post('/post/new/:userId',requireSignin, createPost);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.put('/post/:postId', requireSignin, updatePost);
router.get('/post/:postId', singlePost);
router.delete('/post/:postId', requireSignin, deletePost);


// any routes containing  userId ,our app will first execute userById() 
router.param("userId", userById);

// any routes containing  postId ,our app will first execute postById() 
router.param("postId", postById);


module.exports = router;