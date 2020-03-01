const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('./userModel');
const {jwtSecret} = require('./secrets');
const jwt = require('jsonwebtoken');


router.post('/register', (req, res)=>{
    let newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 12);
    newUser.password = hash;
    
})

module.exports=router;