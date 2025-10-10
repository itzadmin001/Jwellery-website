const dotenv = require("dotenv").config();
const app = require("./src/index");
const connectDB = require("./Db/db");


const PORT = process.env.PORT || 3000;


connectDB();

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
})
