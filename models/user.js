const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cart:[
            {
                product:{
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
    wishlist:[
        {
            product:{
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            addedAt:{
                type: Date,
                default: Date.now 
            }
        }
    ]
});

module.exports=mongoose.model('User',userSchema);