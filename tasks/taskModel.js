module.exports = {
    removeTask,
    updateTask,
    getTasks,
    getTaskById,
    getDeleted,
    addToDeleted
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
    return db('deleted_tasks');
}

