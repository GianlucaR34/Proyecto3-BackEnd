const router = require('express').Router()
const { root } = require('../controllers/adminController')

router.get('/userList', listaUsuarios);
router.post('/createUser', crearUsuario);
router.post('/createRoom', crearHabitacion)
router.post('/createRoom', crearHabitacion)

modules.exports = router;