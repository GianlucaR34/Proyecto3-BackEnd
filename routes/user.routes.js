const router = require('express').Router()
const { loginUsuarios, registrarUsuarios, reservarHabitacion } = require('../controllers/userController')

router.get('/login', loginUsuarios);
router.post('/register', registrarUsuarios);
router.post('/roomReserve', reservarHabitacion)

modules.exports = router;