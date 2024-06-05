import http from 'http'
import express from 'express'
import dotenv from 'dotenv';
dotenv.config();


const app = express()
app.use(express.json())

const httpServer = http.createServer(app)


httpServer.listen(process.env.API_PORT, () => {
    console.log(`Server is running on port : ${process.env.API_PORT}`)
})