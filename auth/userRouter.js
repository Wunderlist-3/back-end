const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('./userModel');
const generateToken = require('./generateToken')


router.post('/register', (req, res)=>{
    let newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 12);
    newUser.password = hash;
    Users.add(newUser)
        .then(user=>res.status(201).json(user))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'error registering new user'})
          })
})

router.post('/login', (req, res)=>{
    let {username, password} = req.body;
    Users.findByUsername(username).first()
        .then(user=>{
            if(user && bcrypt.compareSync(password, user.password)){
                const token = generateToken(user);
                res.status(200).json({message: `welcome ${user.username}`, token})
            } else {
                res.status(401).json({message:'invalid credentials'})
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({message:'server error'})
        })
})

module.exports=router;