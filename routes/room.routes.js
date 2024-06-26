const roomRouter = require('express').Router()
const { listaHabitaciones, habitacionesReservadas, crearHabitacion, reservarHabitacion, modificarHabitacion, cancelarReserva, dateDisables } = require('../controllers/roomController')
const validarJWT = require('../middlewares/JWToken');

roomRouter.get('/roomList', validarJWT, listaHabitaciones);
roomRouter.get('/reservedRooms', validarJWT, habitacionesReservadas);
roomRouter.get('/disableDates', dateDisables)
roomRouter.post('/createRoom', validarJWT, crearHabitacion)
roomRouter.patch('/roomReserve/', validarJWT, reservarHabitacion)
roomRouter.patch('/modifyRoom/:id?', validarJWT, modificarHabitacion)
roomRouter.patch('/cancelReserve/:id?', cancelarReserva)

module.exports = roomRouter;