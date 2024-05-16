const Habitaciones = require('../models/roomSchema')
const Usuario = require('../models/userSchema')
const JWT = require('jsonwebtoken');
const { obtenerFechasEntre } = require('../validators/dateValidator');


const listaHabitaciones = async (req, res) => {
    const listaHabitaciones = await Habitaciones.find()
    return res.status(200).send(listaHabitaciones)
};

const habitacionesReservadas = async (req, res) => {
    //traer habitaciones que tienen reserva solamente
    const token = req.header('TokenJWT')
    if (!token) {
        return res.status(403).json({ msg: "El usuario necesita estar logueado", type: "error" })
    }
    const userBodyJWT = JWT.decode(token)
    // console.log(userBodyJWT)
    const userObject = await Usuario.findOne({ _id: userBodyJWT.id })
    // console.log(userObject.isAdmin)
    if (!userObject.isAdmin) {
        return res.status(403).json({ msg: "El usuario no tiene permiso para ejecutar esta accion", type: "error" })
    }
    const habitaciones = await Habitaciones.find()
    let habitacionesReservadasArray = []
    let habitacionesReservadas = []
    habitaciones.forEach((reservedDate) => {
        if (reservedDate.reservationDates.length > 0) {
            habitacionesReservadasArray.push(reservedDate.number)
        }
    })

    for (let numero in habitacionesReservadasArray) {
        const habitacionReservada = await Habitaciones.findOne({ number: habitacionesReservadasArray[numero] })
        habitacionesReservadas.push(habitacionReservada)
    }

    return res.status(200).send(habitacionesReservadas)
}

const cancelarReserva = async (req, res) => {
    // const listaHabitaciones = await Habitaciones.find()
    //traer las habitaciones donde el usuario tiene reserva

    //extraer el indice

    //eliminar y actualizar el objeto

    return res.status(200).send("listaHabitaciones")
};

const reservarHabitacion = async (req, res) => {
    const habitacionID = req.params.id || req.body.roomNumber;
    const initialDateUser = req.body.initialDate;
    const finalDateUser = req.body.finalDate;

    const token = req.header('TokenJWT')
    if (!token) {
        return res.status(403).json({ msg: "El usuario necesita estar logueado", type: "error" })
    }
    const userBodyJWT = JWT.decode(token)
    if (req.params.id) {
        const usuarioReserva = await Usuario.findOne({ mail: userBodyJWT.name })
        const habitacion = await Habitaciones.findById({ _id: habitacionID })
        const fechasReservadas = habitacion.reservationDates
        const nuevaReserva = {
            idUser: usuarioReserva._id,
            initialDate: new Date(initialDateUser),
            finalDate: new Date(finalDateUser)
        }

        let buscarFechasReservadas = []
        fechasReservadas.forEach((fecha) => {
            buscarFechasReservadas.push(obtenerFechasEntre(fecha.initialDate, fecha.finalDate))
        })
        let todasLasFechasReservadas = []
        buscarFechasReservadas.forEach(fecha => {
            for (let i = 0; i < fecha.length; i++) {
                todasLasFechasReservadas.push(fecha[i].toISOString())
            }
        })
        const isAvailableInitialDate = todasLasFechasReservadas[todasLasFechasReservadas.indexOf((nuevaReserva.initialDate).toISOString())]
        const isAvailablefinalDate = todasLasFechasReservadas[todasLasFechasReservadas.indexOf((nuevaReserva.finalDate.toISOString()))]

        if (!isAvailableInitialDate && !isAvailablefinalDate) {
            habitacion.reservationDates.push(nuevaReserva)
            await Habitaciones.findByIdAndUpdate({ _id: habitacionID }, habitacion, { new: true })
            return res.status(200).json({ msg: "Reserva realizada con exito", type: "success" })
        }
        return res.status(403).json({ msg: "Las fechas no estan disponibles", type: "error" })
    } else {
        const usuarioReserva = await Usuario.findOne({ mail: userBodyJWT.name })
        const habitacion = await Habitaciones.findOne({ number: habitacionID })
        const fechasReservadas = habitacion.reservationDates
        const nuevaReserva = {
            idUser: usuarioReserva._id,
            initialDate: new Date(initialDateUser),
            finalDate: new Date(finalDateUser)
        }

        let buscarFechasReservadas = []
        fechasReservadas.forEach((fecha) => {
            buscarFechasReservadas.push(obtenerFechasEntre(fecha.initialDate, fecha.finalDate))
        })
        let todasLasFechasReservadas = []
        buscarFechasReservadas.forEach(fecha => {
            for (let i = 0; i < fecha.length; i++) {
                todasLasFechasReservadas.push(fecha[i].toISOString())
            }
        })
        const isAvailableInitialDate = todasLasFechasReservadas[todasLasFechasReservadas.indexOf((nuevaReserva.initialDate).toISOString())]
        const isAvailablefinalDate = todasLasFechasReservadas[todasLasFechasReservadas.indexOf((nuevaReserva.finalDate.toISOString()))]

        if (!isAvailableInitialDate && !isAvailablefinalDate) {
            habitacion.reservationDates.push(nuevaReserva)
            await Habitaciones.findByIdAndUpdate({ _id: habitacion._id }, habitacion, { new: true })
            return res.status(200).json({ msg: "Reserva realizada con exito", type: "success" })
        }
        return res.status(403).json({ msg: "Las fechas no estan disponibles", type: "error" })
    }
};

const modificarHabitacion = async (req, res) => {
    //trae una habitacion con el id en el param y puede actualizarse completa o parcialmente (por ejemplo se puede actualizar el precio o todo lo demás)
    console.log("hola")
    return res.status(201).send("Everything ok")
};

const crearHabitacion = async (req, res) => {
    const { type, number, price, photo, reservationDates } = req.body
    const token = req.header('TokenJWT')
    if (!token) return res.status(403).json({ msg: "El usuario necesita estar logueado", type: "error" })
    const userBodyJWT = JWT.decode(token)
    let Habitacion = await Habitaciones.findOne({ number: number })
    if (Habitacion) {
        return res.status(400).json({ msg: "La habitacion ya se encuentra creada", type: "error" })
    }
    if (!userBodyJWT.isAdmin) {
        return res.status(403).json({ msg: "Esta acción no esta permitida por el usuario", type: "error" })
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


module.exports = { listaHabitaciones, reservarHabitacion, modificarHabitacion, crearHabitacion, habitacionesReservadas, cancelarReserva }