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
    return db('tasks');
}

function getTaskById(id){
    return db('tasks').where({id});
}

function removeTask(id){
    return db('tasks').where({id}).del();
}

function updateTask(id, task){
    return db('tasks').where({id}).update(task);
}

function addToDeleted(id){
    console.log('from task model', id);
    const now = Date.now();
    const task = {
        task_id: id,
        date_deleted: now, 
        date_expired: now + 604800
    }
    return db('deleted_tasks').insert(task)
}

function getDeleted(){
    return db('deleted_tasks')
        .join('tasks', 'deleted_tasks.task_id', 'tasks.id')
        // .join('lists', 'tasks.list_id', 'lists.id')
        // .join('user_lists', 'user_lists.list_id', 'lists.id')
        // .join('users', 'users.id', 'user_lists.user_id')
        // .select('task_id', 'tasks.description', 'lists.id as list_id', 'date_deleted', 'date_expired')
}

function removeDeleted(id){
    return db('deleted_tasks').where({task_id: id}).del();
}

function removeAssocTasks(list_id, task){
    task[0].deleted = 1;
    return db('tasks').where({list_id}).update(task[0])
}

