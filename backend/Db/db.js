const mongoose = require("mongoose");



function connectDB() {
    mongoose.connect(process.env.MONGO_URL, {
        dbName: "Jewellery_Store"
    })
        .then((success) => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.log("Error connecting to MongoDB", error);
        })
}

module.exports = connectDB;