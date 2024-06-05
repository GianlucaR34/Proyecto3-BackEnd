const Habitaciones = require('../models/roomSchema')
const Usuario = require('../models/userSchema')
const JWT = require('jsonwebtoken');
const { obtenerFechasEntre } = require('../validators/dateValidator');


const listaHabitaciones = async (req, res) => {
    //parametros necesarios
    const token = req.header('TokenJWT')
    const userJWT = JWT.decode(token)
    const user = await Usuario.findById({ _id: userJWT.id })

    //si el usuario logueado es admin, traer todas las habitaciones
    if (user.isAdmin) {
        try {
            const page = req.query.page || 0 //Parametro paginacion con 20 resultados aproximadamente con los atributos de las habitaciones
            const roomPerPage = 10
            const listaHabitaciones = await Habitaciones.find().skip(page * roomPerPage).limit(roomPerPage)
            return res.status(200).send(listaHabitaciones)
        } catch (error) {
            return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
        }
    }
    //si el usuario logueado es un usuario, traerle todas las fechas reservadas.
    try {
        const page = req.query.page || 0 //Parametro paginacion con 20 resultados aproximadamente con los atributos de las habitaciones
        const roomPerPage = 9
        const listaHabitaciones = await Habitaciones.find().skip(page * roomPerPage).limit(roomPerPage)
        return res.status(200).send(listaHabitaciones)
    } catch (error) {
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
    }
};

const habitacionesReservadas = async (req, res) => {
    //traer habitaciones que tienen reserva solamente
    const token = req.header('TokenJWT')
    if (!token) {
        return res.status(403).json({ msg: "El usuario necesita estar logueado", type: "error" })
    }
    const userBodyJWT = JWT.decode(token)
    try {
        const userObject = await Usuario.findOne({ _id: userBodyJWT.id })
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
    } catch (error) {
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
    }

}

const cancelarReserva = async (req, res) => {
    const token = req.header('TokenJWT')
    if (!token) {
        return res.status(403).json({ msg: "El usuario necesita estar logueado", type: "error" })
    }
    const userBodyJWT = JWT.decode(token)
    try {
        const user = await Usuario.findOne({ mail: userBodyJWT.name })
        const listaHabitaciones = await Habitaciones.find()
        if (user.isAdmin) {
            let indexHabitacion
            listaHabitaciones.forEach((habitacion, index) => {
                if (habitacion.number == req.body.number) indexHabitacion = index
            })

            const habitacion = listaHabitaciones[indexHabitacion]
            const reservedDatesFromRoom = habitacion.reservationDates
            reservedDatesFromRoom.pop(indexHabitacion)
            await Habitaciones.findByIdAndUpdate({ _id: habitacion._id }, { reservationDates: reservedDatesFromRoom }, { new: true })


        } else {
            if (req.params.id) return res.status(403).json({ msg: "No tiene permitido realizar esa accion", type: "error" })

            const fechaInicial = new Date(req.body.initialDate)
            const fechaFinal = new Date(req.body.finalDate)
            let indexHabitacion
            listaHabitaciones.forEach((habitacion, index) => {
                if (habitacion.number == req.body.number) indexHabitacion = index
            })
            if (!indexHabitacion) return res.status(404).json({ msg: "No hay ninguna habitacion que hayas reservado", type: "error" })
            let reservaUser
            listaHabitaciones.forEach((habitacion) => {
                habitacion.reservationDates.find((reserva) => {
                    if (reserva.idUser == user._id && fechaInicial - reserva.initialDate == 0 && fechaFinal - reserva.finalDate == 0) {
                        reservaUser = reserva
                    }
                })
            })
            if (!reservaUser) return res.status(404).json({ msg: "Reserva no encontrada", type: "error" })


            const habitacion = listaHabitaciones[indexHabitacion]
            const reservedDatesFromRoom = habitacion.reservationDates
            reservedDatesFromRoom.pop(indexHabitacion)
            await Habitaciones.findByIdAndUpdate({ _id: habitacion._id }, { reservationDates: reservedDatesFromRoom }, { new: true })
            return res.status(200).json({ msg: "Reserva cancelada exitosamente", type: "success" })
        }

    } catch (error) {
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });

    }
};

const reservarHabitacion = async (req, res) => {
    const habitacionID = req.body.roomNumber;
    const initialDateUser = req.body.initialDate;
    const finalDateUser = req.body.finalDate;
    const data = req.body
    const token = req.header('TokenJWT')
    if (!token) {
        return res.status(403).json({ msg: "El usuario necesita estar logueado", type: "error" })
    }
    const userBodyJWT = JWT.decode(token)
    try {
        const usuarioReserva = await Usuario.findOne({ mail: userBodyJWT.name })
        const habitacion = await Habitaciones.findOne({ number: habitacionID })
        const fechasReservadas = habitacion.reservationDates
        const nuevaReserva = {
            idUser: usuarioReserva._id,
            initialDate: new Date(initialDateUser),
            finalDate: new Date(finalDateUser),
            headName: data.Nombre,
            headSurname: data.Apellido,
            headDNI: data.DNI,
        }
        if (fechasReservadas.length != 0) {

            let buscarFechasReservadas
            fechasReservadas.forEach((fecha) => {
                buscarFechasReservadas = obtenerFechasEntre(fecha.initialDate, fecha.finalDate)
            })

            function tieneInterseccion(array1, array2) {
                return array1.some(elemento => array2.includes(elemento));
            }
            function esSubconjunto(array1, array2) {
                return array1.every(elemento => array2.includes(elemento));
            }


            const isAvailableDate = () => {
                const dateUser = obtenerFechasEntre(nuevaReserva.initialDate, nuevaReserva.finalDate)
                const dateTaken = buscarFechasReservadas
                const isIntersected = tieneInterseccion(dateTaken, dateUser)
                const isSubset = esSubconjunto(dateTaken, dateUser)
                const availableDate = (isIntersected || isSubset) ? false : true;
                return availableDate
            }

            if (isAvailableDate()) {
                habitacion.reservationDates.push(nuevaReserva)
                await Habitaciones.findByIdAndUpdate({ _id: habitacion._id }, habitacion, { new: true })
                return res.status(200).json({ msg: "Reserva realizada con exito", type: "success" })
            }
        } else if (fechasReservadas.length == 0) {
            habitacion.reservationDates.push(nuevaReserva)
            await Habitaciones.findByIdAndUpdate({ _id: habitacion._id }, habitacion, { new: true })
            return res.status(200).json({ msg: "Reserva realizada con exito", type: "success" })
        }
        return res.status(403).json({ msg: "Las fechas no estan disponibles", type: "error" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
    }

}

const modificarHabitacion = async (req, res) => {
    //trae una habitacion con el id en el param y puede actualizarse completa o parcialmente (por ejemplo se puede actualizar el precio o todo lo demás)
    const token = req.header('TokenJWT')
    const userBodyJWT = JWT.decode(token)
    try {
        const habitacion = await Habitaciones.findOne({ number: req.body.number })
        const isAdmin = (await Usuario.findOne({ mail: userBodyJWT.name })).isAdmin
        if (!habitacion) return res.status(400).json({ msg: "La habitacion ingresada no existe" });
        if (!isAdmin) {
            return res.status(403).json({ msg: "Esta acción no está permitida", type: "error" })
        }
        await Habitaciones.findByIdAndUpdate({ _id: habitacion._id }, req.body, { new: true })
        return res.status(201).json({ msg: "Habitacion actualizada exitosamente", type: "success" })
    } catch (error) {
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
    }

};

const crearHabitacion = async (req, res) => {
    const { type, number, price, photo, reservationDates, description, numberOfGuestMax, bath, meals } = req.body

    try {
        let Habitacion = await Habitaciones.findOne({ number: number })
        if (Habitacion) {
            return res.status(400).json({ msg: "La habitacion ya se encuentra creada", type: "error" })
        }
        const token = req.header('TokenJWT')
        if (!token) return res.status(403).json({ msg: "El usuario necesita estar logueado", type: "error" })
        const userBodyJWT = JWT.decode(token)
        const userAccess = await Usuario.findOne({ mail: userBodyJWT.name })
        if (!userAccess.isAdmin) {
            return res.status(403).json({ msg: "Esta acción no esta permitida por el usuario", type: "error" })
        }

        Habitacion = new Habitaciones({ type, number, price, photo, reservationDates, description, numberOfGuestMax, bath, meals })
        await Habitacion.save()
        return res.status(201).json({
            msg: "Habitacion creada correctamente",
            type: "success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Error interno del servidor", type: "error" });
    }
};

const dateDisables = async (req, res) => {
    try {
        const habitaciones = await Habitaciones.find()
        if (!habitaciones) res.status(400).json({ msg: "No se han encontrado habitaciones creadas", type: "error" })
        const fechasReservadasPorHabitacion = []
        const todasLasFechasReservadas = []
        habitaciones.forEach(element => {
            if (element.reservationDates.length > 0) {
                element.reservationDates.forEach((usuario) => {
                    fechasReservadasPorHabitacion.push([usuario.initialDate, usuario.finalDate, element.number
                    ])
                })
            }
        });
        //todas las fechas reservadas
        fechasReservadasPorHabitacion.forEach((fecha) => {
            const dateBatch = obtenerFechasEntre(fecha[0], fecha[1])
            dateBatch.forEach(date => {
                let doesExists = todasLasFechasReservadas.includes(date)
                if (!doesExists) {
                    newDate = date
                    todasLasFechasReservadas.push(newDate)
                }
            })
        })
        res.status(200).send(todasLasFechasReservadas)
    } catch (error) {
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor", type: "error" })
    }
    //tengo que pensar si restringir las reservas por rangos dependiendo de la habitacion o restringir en general las fechas ya reservadas aunque no sea la misma habitacion

}
module.exports = { listaHabitaciones, reservarHabitacion, modificarHabitacion, crearHabitacion, habitacionesReservadas, cancelarReserva, dateDisables }