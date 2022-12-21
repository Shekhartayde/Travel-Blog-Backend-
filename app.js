import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routing/user-routes'
import postRouter from './routing/post-routes'

const app=express()
dotenv.config()

//middlewares
app.use(express.json())
app.use('/user',userRouter)
app.use('/post',postRouter)



//connection
mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.vplb8qs.mongodb.net/?retryWrites=true&w=majority`).then(app.listen(5000,()=>console.log("Connected succesfully and listening to port 5000"))).catch((err)=>console.log(err))


