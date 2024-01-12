import express from "express";
import * as dotenv from "dotenv";
import { UserRouter } from "./src/routes/UserRoute.js";
import { dbConnection } from "./src/config/Db.config.js";
import { AdminRouter } from "./src/routes/AdminRoute.js";
import { CommonRouter } from "./src/routes/CommonRoutes.js";
import cors from "cors"
dotenv.config()
const  PORT = process.env.PORT || 8000
const app = express();
dbConnection()
app.use(cors({origin: "*"}))
app.use("/uploads",express.static("./public/uploads"));
app.use(express.json())
app.use("/api/admin", AdminRouter)
app.use("/api/user", UserRouter)
app.use("/api/common", CommonRouter)
app.listen(PORT, ()=> {
    console.log(`Listening port #${PORT}`);
})