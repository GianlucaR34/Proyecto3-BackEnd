const roomRouter = require('express').Router()
const { listaHabitaciones, habitacionesReservadas, crearHabitacion, reservarHabitacion, modificarHabitacion, cancelarReserva } = require('../controllers/roomController')
const validarJWT = require('../middlewares/JWToken');

roomRouter.get('/roomList', validarJWT, listaHabitaciones);
roomRouter.get('/reservedRooms', validarJWT, habitacionesReservadas);
roomRouter.post('/createRoom', validarJWT, crearHabitacion)
roomRouter.patch('/roomReserve/', validarJWT, reservarHabitacion)
roomRouter.patch('/modifyRoom/', validarJWT, modificarHabitacion)
roomRouter.patch('/cancelReserve/:id?', cancelarReserva)

module.exports = roomRouter;