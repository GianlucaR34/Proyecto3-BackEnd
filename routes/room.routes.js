const roomRouter = require('express').Router()
const { listaHabitaciones, habitacionesReservadas, crearHabitacion, reservarHabitacion, modificarHabitacion, cancelarReserva } = require('../controllers/roomController')

roomRouter.get('/roomList', listaHabitaciones);
roomRouter.get('/reservedRooms', habitacionesReservadas);
roomRouter.post('/createRoom', crearHabitacion)
roomRouter.post('/roomReserve', reservarHabitacion)
roomRouter.patch('/modifyRoom', modificarHabitacion)
roomRouter.patch('/cancelReserve', cancelarReserva)

modules.exports = router;