const Habitaciones = require('../models/roomSchema')

const listaHabitaciones = async (req, res) => {
    const listaHabitaciones = await Habitaciones.find()

    res.status(200).send(listaHabitaciones)
};

const cancelarReserva = async (req, res) => {
    // const listaHabitaciones = await Habitaciones.find()

    res.status(200).send("listaHabitaciones")
};

const reservarHabitacion = async (req, res) => {
    console.log("hola")
    res.status(201).send("Everything ok")

};

const modificarHabitacion = async (req, res) => {
    console.log("hola")
    res.status(201).send("Everything ok")

};

const crearHabitacion = async (req, res) => {
    const { type, number, price, photo, reservationDates } = req.body
    const token = req.header('TokenJWT')
    const userBodyJWT = JWT.decode(token)
    let Habitacion = await Habitaciones.findOne({ number: number })
    if (Habitacion) {
        return res.status(400).json({ msg: "La habitacion ya se encuentra creada", type: "error" })
    }

    try {
        Habitacion = new Habitaciones({ type, number, price, photo, reservationDates })
        await Habitacion.save()
        return res.status(201).json({
            msg: "Habitacion creada correctamente",
            type: "success"
        })
    } catch (error) {
        console.debug(error)
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });

    }
};


module.exports = { listaHabitaciones, reservarHabitacion, modificarHabitacion, crearHabitacion }