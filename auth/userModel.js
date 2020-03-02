module.exports = {
    add,
    findByUsername
}

const db = require('../data/db-config');


function add(user){
    return db('users').insert(user).returning('*')
}

function findByUsername(username){
    return db('users').where({username})
}

