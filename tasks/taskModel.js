module.exports = {
    removeTask,
    updateTask,
    getTasks,
    getTaskById,
    getDeleted,
    addToDeleted,
    removeDeleted,
    removeAssocTasks
}

const db = require('../data/db-config')

function getTasks(){
    return db('tasks').returning('*')
}

function getTaskById(id){
    return db('tasks').where({id}).returning('*')
}

function removeTask(tasks){
    return db('tasks').whereIn('id', tasks).del().returning('*');
}

function updateTask(id, task){
    return db('tasks').where({id}).update(task).returning('*')
}

function addToDeleted(id){
    const now = Date.now();
    const next = new Date().setDate(+9);


    var offset = new Date().getTimezoneOffset();


    const date = new Date(now + (offset));
    const nextweek = new Date(next + (offset));
    const dateStr = date.toUTCString().toLowerCase();
    const nextweekStr = nextweek.toUTCString()




    const task = {
        task_id: id,
        date_deleted: dateStr, 
        date_expired: nextweekStr
    }
    return db('deleted_tasks').insert(task).returning('*')
}

function getDeleted(id){
    return db('deleted_tasks')
        .join('tasks', 'deleted_tasks.task_id', 'tasks.id')

        .join('lists', 'tasks.list_id', 'lists.id')
        .join('user_lists', 'user_lists.list_id', 'lists.id')
        .join('users', 'users.id', 'user_lists.user_id')
        // .select('task_id', 'tasks.description', 'lists.id as list_id', 'date_deleted', 'date_expired')
        .select('task_id', 'lists.id as list_id', 'users.id as user_id', 'tasks.description', 'date_deleted', 'date_expired')
        .where({user_id: id})
}

function removeDeleted(taskids){
    // const now = Date.now();
    // var offset = new Date().getTimezoneOffset();
    // const date = '2019-01-01T04:00:00.000Z';
    // tasks.forEach(task=>{
    //     return db('deleted_tasks')
    // })
    // return db('deleted_tasks').where(tasks.date_expired <= date).del().returning('*')

    return db('deleted_tasks').whereIn('task_id', taskids).del().returning('*')
    }
    

    // return db('deleted_tasks').join('tasks', 'deleted_tasks.task_id', 'tasks.id').select("*")
    
    // .where(tasks.deleted = ).del().returning('*')


function removeAssocTasks(list_id, task){
    task[0].deleted = 1;
    return db('tasks').where({list_id}).update(task[0]).returning('*')
}

