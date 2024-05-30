const { model, Schema } = require('mongoose')

const Habitaciones = new Schema({
    photo: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bath: {
        type: Number,
    },
    meals: {
        type: Number,
    },
    number: {
        type: Number,
        required: true,
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
        }
    }
    ],
})


module.exports = model("Habitacion", Habitaciones)