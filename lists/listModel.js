module.exports = {
    getLists,
    addList,
    addTask,
    getToday,
    addListId,
    getUserLists,
    getMyLists,
    removeList,
    updateList,
    removeUserList,
    getListTasks,
    getMonth
}

const db = require('../data/db-config')


function getLists(){
    return db('lists');
}

function getListTasks(list_id){
    return db('tasks').where({list_id}).andWhere({deleted: 0})
}

function addList(list){
    return db('lists').insert(list).returning('*')
}

function addListId(list){
    return db('user_lists').insert(list).returning('*');
}

function getUserLists(){
    return db('user_lists');
}

function addTask(task, list_id){
    return db('tasks').where({list_id}).insert(task).returning('*')
}

function getToday({day, weekday, month}, user_id){
    console.log('user_id from the listmodel', user_id);
    return db('tasks')
    .join('lists', 'tasks.list_id', 'lists.id')
    .join('user_lists', 'user_lists.list_id', 'tasks.list_id')
    // .join('users', 'user_lists.user_id', `users.id`)
    .join('users', function() {
        this.on('user_lists.user_id', '=', 'users.id').onIn('users.id', user_id)
      })
    .select('tasks.id as task_id','users.id as user_id', 'users.username', 'lists.name', 'lists.id as list_id', 'tasks.description', 'tasks.frequency', 'tasks.day', 'tasks.weekday', 'tasks.month')
    
    .where({frequency: 'daily'}).where({'users.id': user_id}).where({deleted: 1})
    
    .orWhere({frequency: 'weekly'}).andWhere({weekday})
    
    .orWhere({frequency: 'monthly'}).andWhere({day}).andWhere({month: null}).orWhere({frequency: 'annually'}).andWhere({month}).andWhere({day})
    
}

function getMonth({day, weekday, month}, user_id){
    console.log('user_id from the listmodel', user_id);
    return db('tasks')
    .join('lists', 'tasks.list_id', 'lists.id')
    .join('user_lists', 'user_lists.list_id', 'tasks.list_id')
    // .join('users', 'user_lists.user_id', `users.id`)
    .join('users', function() {
        this.on('user_lists.user_id', '=', 'users.id').onIn('users.id', user_id)
      })
    .select('tasks.id as task_id', 'users.id as user_id', 'lists.id as list_id', 'users.username', 'lists.name', 'tasks.description', 'tasks.frequency', 'tasks.day', 'tasks.weekday', 'tasks.month')
    
    .where({frequency: 'daily'}).where({'users.id': user_id}).where({deleted: 1})
    
    .orWhere({frequency: 'weekly'}).andWhere({weekday})
    
    .orWhere({frequency: 'monthly'})
    .orWhere({frequency: 'annually'}).andWhere({month})
    
}


function getMyLists(user_id){
    return db('user_lists')
        .join('users', 'user_lists.user_id', 'users.id')
        .join('lists', 'user_lists.list_id', 'lists.id')
        // .join('tasks', 'user_lists.list_id', 'tasks.list_id')
        // .select('user_lists.list_id', 'user_id', 'users.username', 'lists.name', 'tasks.description')
        .select('user_lists.list_id', 'user_id', 'users.username', 'lists.name')
        .where({user_id})
}

// SELECT list_id, user_id, users.username, lists.name
// FROM user_lists
// JOIN users ON user_lists.user_id=users.id
// JOIN lists ON user_lists.list_id=lists.id
// JOIN tasks ON user_lists.list_id=tasks.list_id

function removeList(id){
    return db('lists').where({id}).del();
}

function updateList(id, list){
    return db('lists').where({id}).update(list);
}

function removeUserList(id, user_id){
    return db('user_lists').where({list_id: id}).andWhere({user_id}).del()
}