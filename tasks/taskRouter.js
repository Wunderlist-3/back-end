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


//look at trash
router.get('/deleted', (req, res)=>{
    DB.getDeleted(req.decodedToken.subject)
        .then(tasks=>{
            // console.log(tasks);
            let newTasks = tasks.map(task=>{
                const now = Date.now();
                var offset = new Date().getTimezoneOffset();
                const date = new Date(now + (offset));
                console.log('date', now)
                const expireddate = task.date_expired;
                const expiredstring = expireddate.toUTCString()
                const exp1 = Date.now(expiredstring);
                const exp = Number(exp1)
                const please = Number(now);
                // const date = '2020-03-09T04:00:00.000Z';
                console.log(task);
                console.log('exp', exp, 'please', please)
                if (exp <= please){
                    return task.task_id;
                }
            })
            console.log('newTasks', newTasks);
            if (newTasks[0] !== undefined){
                DB.removeDeleted(newTasks)
                .then(rem=>{
                    rem? 
                    DB.getDeleted(req.decodedToken.subject)
                        .then(deltasks=>{
                            DB.removeTask(newTasks)
                                .then(del=>res.status(200).json(del))
                                .catch(err=>{
                                    console.log(err);
                                    res.status(500).json({message: 'error actually deleting tasks'})
                                })
                        })
                        .catch(err=>{
                            console.log(err);
                            res.status(500).json({message:'error retrieving remaining tasks'})
                        }) : res.status(200).json(tasks);
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({message: 'server error'})
                })
            } else {
                res.status(200).json(tasks)
            }
            
            // res.status(200).json(tasks)
            
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'failed to get deleted tasks'}) 
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
    //add 'deleted' task to the deleted_tasks table
    DB.addToDeleted(req.params.id)
        .then(del=>{
            //find the task by its id
            DB.getTaskById(req.params.id)
                .then(task=>{
                    //mark that task as deleted
                    task[0].deleted = true;
                    console.log('from the delete', task);
                    console.log('task', task[0]);
                    //update the task as deleted in the tasks table
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


router.get('/restore/:id', (req, res)=>{
    DB.getTaskById(req.params.id)
        .then(task=>{
            const newTask = task[0];
            newTask.deleted = false;
            console.log('from restore', newTask);
            DB.updateTask(req.params.id, newTask)
                .then(removed=>{
                    DB.removeDeleted([req.params.id])
                        .then(task=>res.status(200).json(task))
                        .catch(err=>{
                        console.log(err);
                        res.status(500).json({message: 'failed to delete task'}) 
                        })
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({message:"server error"})
                })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'failed to get task by id'}) 
        })
    

})



module.exports=router;