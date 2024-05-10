const express = require('express')
const dbConnection = require('./connections/dbConnection')

const app = express();

app.use(express.json())

dbConnection()

app.listen(process.env.PORT, () => {
    console.debug(`ejecutando servidor en el puerto ${process.env.PORT}`);
})