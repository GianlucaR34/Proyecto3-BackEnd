const router = require('express').Router()
const { root } = require('../controllers/adminController')

router.get('/userList', listaUsuarios);
router.get('/roomList', listaHabitaciones);
router.get('/reservedRooms', habitacionesReservadas);
router.post('/createUser', crearUsuario);
router.post('/createRoom', crearHabitacion)
router.patch('/modifyUser/:id', modificarUsuario)
router.patch('/modifyRoom/:id', modificarHabitacion)

modules.exports = router;