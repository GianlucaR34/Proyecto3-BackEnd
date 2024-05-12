const Usuario = require('../models/userSchema')
// const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const { emailRegexp, passwordRegexp } = require('../validators/validator');
// dotenv.config()

const loginUsuarios = async (req, res) => {
    const { mail, password } = req.body
    const userObject = await Usuario.findOne({ mail: mail })
    if (!userObject) {
        return res.status(401).json({ msg: "Combinacion de usuario y contraseña incorrectos", type: "error" })
    } else if (await bcrypt.compare(password, userObject.password) == false) {
        return res.status(401).json({ msg: "Combinacion de usuario y contraseña incorrectos", type: "error" })
    } else {
        //Aca iria el codigo de JWT
        res.status(200).json({ msg: "Usuario Logueado correctamente", type: "success" })
    }
};

const registrarUsuarios = async (req, res) => {
    const { mail, password } = req.body
    let User = await Usuario.findOne({ mail: mail })
    //validaciones
    if (emailRegexp.test(mail) == false) {
        console.log(emailRegexp.test(mail))
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
            console.debug(error)
            return res.status(500).json({ msg: "Error interno del servidor", type: "error" });

        }

    }
};

const deleteUsuarios = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ msg: "Usuario no encontrado", type: "error" });
        }
        return res.status(200).json({ msg: "Usuario eliminado correctamente", type: "success" });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
    }
}

module.exports = { loginUsuarios, registrarUsuarios, deleteUsuarios }