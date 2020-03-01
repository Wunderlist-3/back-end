const {jwtSecret} = require('./secrets');
const jwt = require('jsonwebtoken');

module.exports = (user) => {
    const payload = {
        subject: user.id,
        username: user.username
    }
    const options = {
        expiresIn: '1h'
    }
    return jwt.sign(payload, jwtSecret, options)
}