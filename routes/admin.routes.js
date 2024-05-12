const router = require('express').Router()
const { root } = require('../controllers/adminController')

router.get('/userList', listaUsuarios);
router.get('/roomList', listaHabitaciones);
router.get('/reservedRooms', habitacionesReservadas);
router.post('/createUser', crearUsuario);
router.post('/createRoom', crearHabitacion)
router.patch('/modifyUser', modificarUsuario)
router.patch('/modifyRoom', modificarHabitacion)

modules.exports = router;