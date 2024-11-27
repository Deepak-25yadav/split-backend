import express from "express";
import cors from "cors";
import chalk from 'chalk';
import dotenv from 'dotenv'
import { connection } from "./config/db.js";
import { userRouter } from "./routes/userRouter.js";



dotenv.config()

const app = express()
app.use(express.json())

app.use(cors());

app.get("/app",async(req,res)=>{
try {
    console.log("Health is Okk")
    res.json("Health is OK")
} catch (error) {
    res.json("Health is not OKK",error)
}
})


app.use("/api/user",userRouter)

app.listen(process.env.PORT||8800,()=>{
   try {
    connection()
    console.log(chalk.blue.italic(`Your server is running on this port ${process.env.PORT}`))
   } catch (error) {
    console.log(chalk.yellow.italic("Here something error to running server on port 8800"),error)
   } 
})

