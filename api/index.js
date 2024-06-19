import mongoose from "mongoose";
import dotenv from 'dotenv';
import express from 'express';
import Userrouter from "./routes/user.route.js";
import authRouter from './routes/auth.router.js';
import listingRouter  from "./routes/listing.router.js";
import cookieParser from "cookie-parser"
import path from 'path';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>
   {
      console.log("MONGODB created")
   }).catch((err)=>
      {
         console.log(err)
      })


      const path = require('path');
      const __dirname = path.resolve();      
const app = express();


app.use(express.json());

app.use(cookieParser());


app.listen(3000 , ()=>
   {
      console.log("server is started 3000")
   })
app.use('/api/user' , Userrouter);
app.use('/api/auth' , authRouter);
app.use('/api/listing', listingRouter);


app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.use((err , req , res , next)=>
   {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      return res.status(statusCode).json(
         {
            success : false,
            statusCode ,
            message,
         })
   })