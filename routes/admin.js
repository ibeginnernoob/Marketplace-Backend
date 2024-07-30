const path=require('path');
const express=require('express');
const multer=require('multer');

const adminController=require('../controllers/admin.js');
const isAdmin=require('../middlewares/is-auth.js').isAdmin;

const router=express.Router();

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..','images'))
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+'-'+file.originalname)
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}

const upload=multer({storage:fileStorage,fileFilter:fileFilter});

router.get('/add-product',isAdmin,adminController.getAddAdminProduct);

router.post('/add-product',upload.fields([
        { name: 'productImage1', maxCount: 1 },
        { name: 'productImage2', maxCount: 1 },
        { name: 'productImage3', maxCount: 1 },
        { name: 'productImage4', maxCount: 1 },
        { name: 'productImage5', maxCount: 1 }
    ]),isAdmin,adminController.postAddAdminProduct);

router.get('/admin-products',isAdmin,adminController.adminProducts);

router.post('/add-to-shop',isAdmin,adminController.addToShop);

router.post('/remove-from-shop',isAdmin,adminController.removeFromShop);

router.post('/delete-product',isAdmin,adminController.deleteProduct);

router.get('/edit-product/:productId',isAdmin,adminController.getEditProduct);

router.post('/edit-product',upload.fields([
    { name: 'productImage1', maxCount: 1 },
    { name: 'productImage2', maxCount: 1 },
    { name: 'productImage3', maxCount: 1 },
    { name: 'productImage4', maxCount: 1 },
    { name: 'productImage5', maxCount: 1 }
]),isAdmin,adminController.postEditProduct);

module.exports=router;