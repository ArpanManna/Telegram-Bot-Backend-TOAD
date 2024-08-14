import http from 'http'
import express from 'express'
import {router as routes} from './routes/index.js'
import dotenv from 'dotenv';
import connectDatabase from './utils/database.js';
dotenv.config();


const app = express()
connectDatabase()
app.use(express.json())
app.use('/', routes)
const httpServer = http.createServer(app)


httpServer.listen(process.env.API_PORT, () => {
    console.log(`Server is running on port : ${process.env.API_PORT}`)
})