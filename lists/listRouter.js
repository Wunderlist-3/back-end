const router = require('express').Router();
const DB = require('./listModel');
const Tasks = require('../tasks/taskModel')
const TodaysDate = require('../middleware/date')

//add a new list for logged in user
router.post('/', (req, res)=>{
    //user id
    let decodedToken = req.decodedToken;
    console.log('decodedtoken', decodedToken)
    console.log(req.body);
    DB.addList(req.body)
        .then(list=>{
            DB.addListId({list_id: list[0].id, user_id: decodedToken.subject})
                .then(newList=>res.status(200).json(newList))
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({message: 'error adding to third table', error: err.message})
                })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'server error'})
        })
})

//get all lists associated with logged in user, if list has associated tasks
router.get('/mylists', (req,res)=>{
    let decodedToken = req.decodedToken;
    console.log('mylists', decodedToken.subject);
    DB.getMyLists(decodedToken.subject)
        .then(lists=>res.status(200).json(lists))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'server error'})
        })
})


//get all tasks on a particular list
router.get('/:id/tasks', (req, res)=>{
    DB.getListTasks(req.params.id)
        .then(tasks=>res.status(200).json(tasks))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'server error'})
        })
})

router.put('/:id', (req, res)=>{
    DB.updateList(req.params.id, req.body)
        .then(list=>res.status(200).json(list))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'server error'})
        })
})

router.delete('/:id', (req, res)=>{
    DB.getListTasks(req.params.id)
        .then(tasks=>{
            tasks.forEach(task=> {
                task.deleted = 1;
                Tasks.addToDeleted(task.id);
            });
            //remove from lists
    DB.removeList(req.params.id)
    .then(rem=>{
        //remove from user_lists
        DB.removeUserList(req.params.id, req.decodedToken.subject)
            .then(rem=>{res.status(200).json(rem)})
            .catch(err=>{
                console.log(err);
                res.status(500).json({message: 'error deleting from userlists'})
            })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({message: 'error deleting from lists'})
    })
            

        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'server error'})
        })
    
})



//add a task, stating the id of the list you want to add to
router.post('/:id/tasks', (req,res)=>{
    req.body.list_id = req.params.id;
    console.log(req.body);
    DB.addTask(req.body, req.params.id)
        .then(task=>res.status(200).json(task))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'server error'})
        })
})

router.get('/today', TodaysDate, (req, res)=>{
    console.log('date', req.dateObj);
    DB.getToday(req.dateObj, req.decodedToken.subject)
    // DB.getTasks()
        .then(daily => res.status(200).json(daily))
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: 'server error'})
        })
})


module.exports=router;