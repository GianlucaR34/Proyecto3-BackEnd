const { model, Schema } = require('mongoose')

const Habitaciones = new Schema({
    type: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    photo: {
        type: String,
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
        }
    }
    ],
})


module.exports = model("Habitacion", Habitaciones)