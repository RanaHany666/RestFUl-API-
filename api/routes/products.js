
const express =require ('express');
const router = express.Router();
const Product=require('../models/products');
const mongoose=require('mongoose')
const multer =require('multer');
//const path= require("path");



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb (null, new Date().toISOString()+file.originalname);
    }
  });
  
 const upload = multer({ 
     storage:storage
    });

router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs=>{
        const response=
        {
            count:docs.length,
            products:docs.map(doc=>{
                return{
              name:doc.name,
              price:doc.price,
              _id:doc._id,
              request:{
              type:'GET',
            url:'http://localhost:3000/products/'+doc._id
        }                }
            })
        };
       // console.log(docs);
        // if(docs.length>=0){
            res.status(200).json(response);
       // }
       
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });



    })
    // res.status(200).json({
    //     message:'Handling Get requests to /products'
    // })
})
router.post('/',upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    // const product={
    //     name:req.body.name,
    //     price:req.body.price,
    // };
    const product = new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
       // productImage: req.file.path 

    });
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:'Created Product sucessfully'
           , // createdProduct:result
           createdProduct:{
               name:result.name,
               price:result.price,
               _id:result._id,
               request:
               {
                   type:'GET',
                   url:"http://localhost:3000/products/"+result._id

               }


           }
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
   
});
router.get('/:productId',(req,res,next)=>{
    const id =req.params.productId;
    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc=>{
        console.log("From data base" ,doc);
        if(doc){
            res.status(200).json({
                product:doc,
                request:{
                    type:'GET',
                    description:"GET ALL PRODUCTS",
                    url: 'http://localhost:3000/products'

                }
            });
           

        }else{
            res.status(404).json({message:'No vaild entrey found '});

        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
    })
    // if(id==='special'){
    //     res.status(200).json({
    //         messagae:'You discovered the special Id',
    //         Id:id
    //     })
    // }else{
    //     res.status(200).json({
    //         message:'you passed an Id '
    //     })
    // }


})






router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result)
        res.status(200).json({result })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({error:err })  
    })
})

router.delete('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json(result);

    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
    // res.status(200).json({
    //     message:"product deleted"
    // })
})








module.exports=router;