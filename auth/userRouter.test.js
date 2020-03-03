const server = require('../server');
const request = require('supertest');
const db = require('../data/db-config');

describe('userRouter', ()=>{

    describe('Authentication Testing', ()=>{
        
        it('should create a new user and receive token on login', async()=>{
            const newUser = {name:'bob', username:'bob', password:'password'}
            const signup = await request(server).post('/api/auth/register').send(newUser)
            const keys = Object.keys(signup.body[0]);
            expect(keys.includes('user_id')).toBe(true)


            let loggedIn = await request(server).post('/api/auth/login').send({username: newUser.username, password: newUser.password})
            const loggedKeys = Object.keys(loggedIn.body);
            expect(loggedKeys.includes('token')).toBe(true);
            

        })

        it('should delete user', ()=>{
            return request(server).delete('/api/auth/deleteuser')
                .send({username:'bob'})
                .then(res=>{
                    console.log(res.body);
                    expect(res.status).toBe(200);
                    expect(res.body[0].username).toBe('bob')
                })
        })
    })

})