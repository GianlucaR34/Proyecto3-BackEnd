const Usuario = require('../models/userSchema')
const JWT = require('jsonwebtoken')
const validarRolUsuario = async (req, res, next) => {
    //validaciones dependiendo si es usuario o administrador.
    const clientUserID = await Usuario.findOne()
    const token = req.header('TokenJWT')
    const userBodyJWT = JWT.decode(token)
    // console.log(userBodyJWT.name)
    // console.log(req.url) //modify user
    if (!clientUserID.isAdmin && req.url != '/modifyUser/' && req.url != '/createUser/') {
    }




    res.send("ok")
    // next()
}

module.exports = validarRolUsuario