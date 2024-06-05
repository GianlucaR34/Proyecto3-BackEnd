const { model, Schema } = require('mongoose')

const Habitaciones = new Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
    },
    numberOfGuestMax: {
        type: Number,
        required: true,
        default: 1
    },
    photo: {
        type: String,
        required: true,
    },
    bath: {
        type: Number,
    },
    meals: {
        type: Number,
    },
    price: {
        type: Number,
        required: true,
    },
    reservationDates: [{
        idUser: {
            type: String,
        },
        initialDate: {
            type: Date,
        },
        finalDate: {
            type: Date,
        },
        headName: {
            type: String,
        },
        headSurname: {
            type: String,
        },
        headDNI: {
            type: String,
        }
    }],
})


module.exports = model("Habitacion", Habitaciones)