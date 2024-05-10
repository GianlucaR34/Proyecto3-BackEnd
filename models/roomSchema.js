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
    initialDate: {
        type: Date,
        required: true
    },
    finalDate: {
        type: Date,
        required: true
    }
})


modules.exports = model("Habitacion", Habitaciones)