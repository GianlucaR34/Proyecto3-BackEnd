const userRouter = require('express').Router()
const { loginUsuarios, registrarUsuarios, deleteUsuarios, listaUsuarios, modificarUsuario, dateDisables } = require('../controllers/userController');
const validarJWT = require('../middlewares/JWToken');

userRouter.get('/listUser', validarJWT, listaUsuarios);
userRouter.post('/loginUser', loginUsuarios);
userRouter.post('/createUser', registrarUsuarios);
userRouter.patch('/modifyUser/:id?', validarJWT, modificarUsuario)
userRouter.delete('/deleteUser/:id?', validarJWT, deleteUsuarios)
userRouter.get('/disableDates', validarJWT, dateDisables)

module.exports = userRouter;