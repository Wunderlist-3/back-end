const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();
const userRouter = require('./auth/userRouter');
const listRouter = require('./lists/listRouter');
const taskRouter = require('./tasks/taskRouter')
const restricted = require('./middleware/restricted');

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use('/api/auth', userRouter);
server.use('/api/lists', restricted, listRouter);
server.use('/api/tasks', restricted, taskRouter);

server.get('/', (req, res)=>{
    res.status(200).json({message: 'Welcome to Wunderlist'})
})

module.exports=server;
