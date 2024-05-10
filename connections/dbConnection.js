const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("db conectada")
    } catch (error) {
        console.error(error)
    }
}

module.exports = dbConnection