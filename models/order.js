const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const orderSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:[
        {
            productId:{
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            qty:{
                type:Number,
                required:true
            }
        }
    ],
    order_amount:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('Order',orderSchema);