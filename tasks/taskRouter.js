const router = require('express').Router();
const DB = require('./taskModel');
const TodaysDate = require('../middleware/date')

router.get('/', (req, res)=>{
    DB.getTasks()
        .then(tasks=>res.status(200).json(tasks))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'server error'}) 
        })
})

router.get('/:id', (req, res)=>{
    DB.getTaskById(req.params.id)
        .then(task=>res.status(200).json(task))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'failed to get task by id'}) 
        })
})

router.get('/trash', (req, res)=>{
    DB.getDeleted()
        .then(tasks=>res.status(200).json(tasks))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'server error'}) 
        })
})

router.delete('/:id', TodaysDate, (req, res)=>{
    date = req.dateObj
    DB.addToDeleted(req.params.id)
        .then(del=>{
            // DB.getTaskById(req.params.id)
            //     .then(task=>{
            //         task[0].deleted = 1;
            //         console.log('task', task[0]);
            //         DB.updateTask(req.params.id, task[0])
            //             .then(updated=>res.status(200).json(updated))
            //             .catch(err=>{
            //                 console.log(err);
            //                 res.status(500).json({message: 'error updating deleted status'})
            //             })
            //     })
            //     .catch(err=>{
            //         console.log(err);
            //         res.status(500).json({message: 'failed to get task by id'}) 
            res.status(200).json(del)
        // })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'error adding to deleted'}) 
        })
})

router.put('/:id', (req, res)=>{
    DB.updateTask(req.params.id, req.body)
        .then(removed=>res.status(200).json(removed))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message:"server error"})
        })
})

module.exports=router;