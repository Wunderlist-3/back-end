const express = require('express');
const helmet = require('helmet');
const server = express();
const userRouter = require('./auth/userRouter');
const listRouter = require('./lists/listRouter');
const restricted = require('./middleware/restricted')

server.use(express.json());
server.use(helmet());
server.use('/api/auth', userRouter);
server.use('/api/lists', restricted, listRouter);

server.get('/', (req, res)=>{
    res.status(200).json({message: 'Welcome to Wunderlist'})
})

module.exports=server;
