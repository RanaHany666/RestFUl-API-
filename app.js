const express = require("express");
const app = express();
const productRoutes=require('./api/routes/products')
const orderRoutes=require('./api/routes/orders')
const morgan=require('morgan')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
require('dotenv/config');
const path= require("path");


// app.use((req,res)=>{
//     res.status(200).json({
//         messsage:'it works'
//     })
// })

mongoose.connect(process.env.DB_CONNECTION,
    ()=>{
        console.log("connected to mongo Db ")
    });
    app.use('/productImage', express.static('uploads'));

    app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });
//Routes which should handle Requests

app.use('/products',productRoutes)
app.use('/orders',orderRoutes);

app.use((req,res,next)=>{
    const error =new Error('Not found');
    error.status (404);
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    })
})

module.exports = app;
