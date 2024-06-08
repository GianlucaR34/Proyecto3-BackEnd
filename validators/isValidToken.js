const jwt = require('jsonwebtoken')
const isValidToken = (req, res) => {
    try {
        const token = req.header('TokenJWT')
        const isValid = jwt.verify(token, process.env.SECRET_KEY)
        res.send(true)
    } catch (error) {
        res.send(false)
    }
}


module.exports = isValidToken