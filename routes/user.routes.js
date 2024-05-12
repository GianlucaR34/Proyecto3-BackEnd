const userRouter = require('express').Router()
const { loginUsuarios, registrarUsuarios, deleteUsuarios } = require('../controllers/userController')

userRouter.post('/login', loginUsuarios);
userRouter.post('/register', registrarUsuarios);
userRouter.delete('/delete/:id', deleteUsuarios)

module.exports = userRouter;