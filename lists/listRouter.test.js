const server = require('../server');
const request = require('supertest');
const db = require('../data/db-config');

describe('listRouter', ()=>{

        let token = "";

        describe('Adding a new user for testing', ()=>{
            
            it('should create a new user and receive token on login', async()=>{
                const newUser = {name:'jake', username:'jake', password:'password'}
                const signup = await request(server).post('/api/auth/register').send(newUser)    
                let loggedIn = await request(server).post('/api/auth/login').send({username: newUser.username, password: newUser.password})
                token = loggedIn.body.token;
            })
        })



        describe('Adding a new list', ()=>{

            it('should send back name of list', ()=>{
                return request(server).post('/api/lists/').send({name: 'my new list'}).set('Authorization', token)
                    .then(res=>{
                        console.log('the res', res.body)
                        expect(res.body[0].name).toBe('my new list')
                    })
            })

        })


        describe('Deleting user after testing', ()=>{
            it('should delete user', ()=>{
                return request(server).delete('/api/auth/deleteuser')
                    .send({username:'jake'})
                    .then(res=>{
                        console.log(token);
                        expect(res.status).toBe(200);
                        expect(res.body[0].username).toBe('jake')
                    })
            })
        })


})