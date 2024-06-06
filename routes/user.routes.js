const userRouter = require('express').Router()
const { loginUsuarios, registrarUsuarios, deleteUsuarios, listaUsuarios, modificarUsuario, userLoggedIn } = require('../controllers/userController');
const validarJWT = require('../middlewares/JWToken');
const isValidToken = require('../validators/isValidToken');

userRouter.get('/listUser', validarJWT, listaUsuarios);
userRouter.get('/getUserLoggedIn', validarJWT, userLoggedIn);
userRouter.get('/isValidToken', isValidToken);
userRouter.post('/loginUser', loginUsuarios);
userRouter.post('/createUser', registrarUsuarios);
userRouter.patch('/modifyUser/:id?', validarJWT, modificarUsuario)
userRouter.delete('/deleteUser/:id?', validarJWT, deleteUsuarios)

module.exports = userRouter;