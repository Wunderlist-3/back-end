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

function removeTask(id){
    return db('tasks').where({id}).del();
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

function getDeleted(){
    return db('deleted_tasks')
        .join('tasks', 'deleted_tasks.task_id', 'tasks.id')

        // .join('lists', 'tasks.list_id', 'lists.id')
        // .join('user_lists', 'user_lists.list_id', 'lists.id')
        // .join('users', 'users.id', 'user_lists.user_id')
        // .select('task_id', 'tasks.description', 'lists.id as list_id', 'date_deleted', 'date_expired')
}

function removeDeleted(tasks){
    const now = Date.now();
            var offset = new Date().getTimezoneOffset();
            // const date = new Date(now + (offset));
            const expireddate = tasks[0].date_expired;
            console.log(expireddate);
            const date = '2020-03-09T04:00:00.000Z';
    return db('deleted_tasks').join('tasks', 'deleted_tasks.task_id', 'tasks.id').select("*")
    
    // .where(tasks.deleted = ).del().returning('*')
}

function removeAssocTasks(list_id, task){
    task[0].deleted = 1;
    return db('tasks').where({list_id}).update(task[0]).returning('*')
}

