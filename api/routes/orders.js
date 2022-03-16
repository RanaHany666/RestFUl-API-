const express=require('express');
const router=express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:"orderer fetched"
    })
})

router.post('/',(req,res,next)=>{
    const order={
        productId:req.body.productId,
        quantity:req.body.quantity
    }
    res.status(201).json({
        message:"orderwas posted",
        createdOrder:order
    })
})


router.get('/:orderId',(req,res,next)=>{
    
    res.status(200).json({
        message:"order was posted",
        orderId:req.params.orderId

    })
})

router.delete('/:orderId',(req,res,next)=>{
    
    res.status(200).json({
        message:"order was deleted",
        orderId:req.params.orderId

    })
})


module.exports=router;