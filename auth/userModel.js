module.exports = {
    add,
    findByUsername,
    removeUser
}

const db = require('../data/db-config');


function add(user){
    return db('users').insert(user).returning('*')
}

function findByUsername(username){
    return db('users').where({username})
}

function removeUser(username){
    console.log('from removeUser', username)
    return db('users').where({username}).del().returning('*')
}
