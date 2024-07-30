const express=require('express');

const shopController=require('../controllers/shop.js');
const isAuth=require('../middlewares/is-auth.js').isAuth;

const router=express.Router();

//laptop(desktop) routes

router.get('/',shopController.getShop);//common route

router.get('/laptop/product-details/:productId',shopController.getLaptopProductDetails);

router.post('/laptop/search',shopController.postSearchShop);

//mobile routes

router.get('/mobile/product-details/:productId',shopController.getMobileProductDetails);

router.get('/mobile/search-shop-page',shopController.getMobileSearchShop);

router.post('/mobile/search',shopController.postMobileSearchShop);

module.exports=router;