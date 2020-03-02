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

// router.get('/deleted', (req, res)=>{
//     const now = Date.now();
//     var offset = new Date().getTimezoneOffset();
//     const date = new Date(now + (offset));
//     // const dateStr = date.toUTCString().toLowerCase();
//     const dateStr = "2020-03-09T04:00:00.000Z"

//     DB.getDeleted()
//         .then(tasks=>{
//             const now = Date.now();
//             var offset = new Date().getTimezoneOffset();
//             // const date = new Date(now + (offset));
//             const expireddate = tasks[0].date_expired;
//             console.log(expireddate);
//             const date = '2020-03-09T04:00:00.000Z';
//             tasks.forEach(task=>{
//                 if(task.date_expired <= date){
//                     DB.removeDeleted(task.task_id)
//                         .then(task=>res.status(200).json(task))
//                         .catch(err=>{
//                             console.log(err);
//                             res.status(500).json({message: 'failed to delete task'}) 
//                         })
//             // res.status(200).json(tasks);
//                 } else {
//                     res.status(200).json(tasks)
//                 }
//             })


//         })
//         .catch(err=>{
//             console.log(err);
//             res.status(500).json({message: 'server error'}) 
//         })
// })


router.get('/deleted', (req, res)=>{
    DB.getDeleted()
        .then(tasks=>{
            console.log(tasks);
            DB.removeDeleted(tasks)
                .then(rem=>res.status(200).json(rem))
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({message: 'server error'})
                })
            // res.status(200).json(tasks)
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'failed to get task by id'}) 
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

router.delete('/deleted/:id', (req, res)=>{
    DB.removeDeleted(req.params.id)
        .then(task=>res.status(200).json(task))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'failed to delete task'}) 
        })
})



router.delete('/:id', TodaysDate, (req, res)=>{
    date = req.dateObj
    DB.addToDeleted(req.params.id)
        .then(del=>{
            DB.getTaskById(req.params.id)
                .then(task=>{
                    task[0].deleted = 1;
                    console.log('task', task[0]);
                    DB.updateTask(req.params.id, task[0])
                        .then(updated=>res.status(200).json(updated))
                        .catch(err=>{
                            console.log(err);
                            res.status(500).json({message: 'error updating deleted status'})
                        })
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({message: 'failed to get task by id'}) 
                })
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