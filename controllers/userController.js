const Usuario = require('../models/userSchema')
const Habitaciones = require('../models/roomSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { emailRegexp, passwordRegexp } = require('../validators/validator');

const userLoggedIn = async (req, res) => {
    const userBodyJWT = jwt.decode(req.header('TokenJWT'))
    const user = await Usuario.findOne({ mail: userBodyJWT.name })
    const response = { nombre: user.userName, apellido: user.userSurname, dni: user.userIdentification }
    return res.status(200).json(response)
}

const loginUsuarios = async (req, res) => {
    const { mail, password } = req.body
    try {
        const userObject = await Usuario.findOne({ mail: mail })
        if (!userObject) {
            return res.status(401).json({ msg: "Combinacion de usuario y contraseña incorrectos", type: "error" })
        } else if (await bcrypt.compare(password, userObject.password) == false) {
            return res.status(401).json({ msg: "Combinacion de usuario y contraseña incorrectos", type: "error" })
        }
        //Se crea payload del usuario
        const payload = { name: userObject.mail, id: userObject._id, rol: userObject.userType }
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '35m'
        })
        return res.status(200).json({ msg: "Usuario Logueado correctamente", type: "success", token, isAdmin: userObject.isAdmin })
    } catch (error) {
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
    }

};

const registrarUsuarios = async (req, res) => {
    const { mail, password, userName, userSurname, userIdentification } = req.body
    let User = await Usuario.findOne({ mail: mail })
    //validaciones
    if (emailRegexp.test(mail) == false) {
        return res.status(400).json({ msg: "el mail no es valido", type: "error" })
    } else if (!mail || !password) {
        return res.status(400).json({ msg: "Los campos no deben estar vacios", type: "error" })
    } else if (passwordRegexp.test(password) == false) {
        return res.status(400).json({ msg: "La contraseña no cumple con lo requerido de seguridad", type: "error" })
    } else if (User) {
        return res.status(400).json({ msg: "El usuario ya se encuentra registrado", type: "error" })
    } else {
        User = new Usuario(req.body)
        const salt = bcrypt.genSaltSync(10);
        User.password = bcrypt.hashSync(password, salt);
        try {
            await User.save()
            return res.status(201).json({
                msg: "Usuario creado correctamente",
                type: "success"
            })
        } catch (error) {
            return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
        }
    }
};

const deleteUsuarios = async (req, res) => {
    try {
        // const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        const token = req.header('TokenJWT')
        if (!token) return res.status(403).json({ msg: "No tienes permiso para realizar la acción", type: "error" })
        const userBodyJWT = jwt.decode(token)
        const clientUserID = await Usuario.findOne({ mail: userBodyJWT.name || req.body.mail })
        if (!clientUserID) {
            return res.status(404).json({ msg: "Usuario no encontrado", type: "error" });
        } else if (req.url == '/deleteUser/' && !clientUserID.isAdmin) {
            await Usuario.findByIdAndDelete(clientUserID._id)
            return res.status(200).json({ msg: "Usuario eliminado correctamente", type: "success" })
        } else if (req.url = '/deleteUser/' && clientUserID.isAdmin) {
            const idUser = req.params.id
            const userTarget = Usuario.findOne({ _id: idUser })
            if (userTarget.isEditable == false) {
                await Usuario.findByIdAndDelete(idUser)
                return res.status(200).json({ msg: "Usuario eliminado correctamente", type: "success" });
            }
            return res.status(400).json({ msg: "El administrador no se puede eliminar!", type: "error" })
        }
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
    }
}

const listaUsuarios = async (req, res) => {
    try {
        const listaUsuarios = await Usuario.find()
        return res.status(200).send(listaUsuarios)
    } catch (error) {
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
    }

}

const modificarUsuario = async (req, res) => {
    const token = req.header('TokenJWT')
    const userBodyJWT = jwt.decode(token)
    try {
        const clientUserID = await Usuario.findOne({ mail: userBodyJWT.name })
        if (!clientUserID.isAdmin) {
            res.status(403).json({ msg: "No tiene permiso para realizar esta acción", type: "error" })
        }
        const idUser = clientUserID._id
        await Usuario.findByIdAndUpdate({ _id: idUser }, req.body, { new: true })
        res.status(200).json({ msg: "usuario modificado correctamente", type: "success" })
    } catch (error) {
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor", type: "success" })
    }


}
module.exports = { loginUsuarios, registrarUsuarios, deleteUsuarios, listaUsuarios, modificarUsuario, userLoggedIn }