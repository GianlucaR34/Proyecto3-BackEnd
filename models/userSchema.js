const { model, Schema } = require('mongoose')

const Cliente = new Schema({
    mail: {
        type: String,
        required: [true, 'Se requiere el correo de usuario']
    },
    password: {
        //define que tipo de password se requiere y valida que cumpla la expresion regular
        type: String,
        required: [true, 'Se requiere la contraseña de usuario'],
        validate: {
            validator: (v) => process.env.regexp_password.test(v),
            message: props => `${props.value} no es un numero de telefono valido!`
        },
    },
    isEditable: {
        //define si los atributos del usuario creado se puede editar
        type: Boolean,
        default: true,
    },
    isAdmin: {
        //define si el usuario es de tipo admin
        type: Boolean,
        default: false
    },
    userType: {
        // define si el usuario es un cliente vip o un cliente regular
        type: Boolean,
        default: false
    }
})


modules.exports = model("Cliente", Cliente)