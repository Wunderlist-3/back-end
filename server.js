const express = require('express');
const helmet = require('helmet');
const server = express();
const userRouter = require('./auth/userRouter');
const listRouter = require('./lists/listRouter')

server.use(express.json());
server.use(helmet());
server.use('/api/users', userRouter);
server.use('/api/lists', listRouter);

server.get('/', (req, res)=>{
    res.status(200).json({message: 'Welcome to Wunderlist'})
})

module.exports=server;
