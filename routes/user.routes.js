const userRouter = require('express').Router()
const { loginUsuarios, registrarUsuarios, deleteUsuarios, listaUsuarios, modificarUsuario } = require('../controllers/userController');
const validarJWT = require('../middlewares/JWToken');
const validarRol = require('../middlewares/userRol');

userRouter.get('/listUser', validarJWT, validarRol, listaUsuarios);
userRouter.post('/loginUser', loginUsuarios);
userRouter.post('/createUser', registrarUsuarios);
userRouter.patch('/modifyUser/:id?', validarJWT, validarRol, modificarUsuario)
userRouter.delete('/deleteUser/:id?', validarJWT, validarRol, deleteUsuarios)

module.exports = userRouter;