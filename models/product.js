const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const productSchema=new Schema({
    type:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageURL:{
        type:[String],
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    cancel_price:{
        type:Number,
        required:true
    },
    keywords_id:{
        type:[String],
        required:true
    },
    in_shop:{
        type:Boolean,
        required:true
    }
});

module.exports=mongoose.model('Product',productSchema);