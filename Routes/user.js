const express = require('express')
const { userById,allUsers} = require('../Controllers/user')

const router = express.Router();

router.get('/users', allUsers);

// any routes containing  userId ,our app will first execute userById() 
router.param("userId", userById);

module.exports = router;