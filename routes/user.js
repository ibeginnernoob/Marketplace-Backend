const express=require('express');

const userController=require('../controllers/user');
const isAuth=require('../middlewares/is-auth.js').isAuth;

const router=express.Router();

//laptop routes

router.get('/laptop/cart',isAuth,userController.getCart);

router.post('/shop/add-to-cart',isAuth,userController.postAddToCartFromShop);

router.post('/search/add-to-cart',isAuth,userController.postAddToCartFromSearch);

router.get('/laptop/wishlist',isAuth,userController.getWishlist);

//mobile routes

router.get('/mobile/cart',isAuth,userController.getMobileCart);

router.get('/mobile/wishlist',isAuth,userController.getMobileWishlist);

//common routes
router.post('/add-to-wishlist',isAuth,userController.postAddToWishlist);

router.post('/remove-from-wishlist',isAuth,userController.postRemoveFromWishlist);

router.post('/details/add-to-cart',isAuth,userController.postAddToCartFromDetails);

router.post('/wishlist/add-to-cart',isAuth,userController.postAddToCartFromWishlist);

router.post('/remove-from-cart',isAuth,userController.postRemoveFromCart);

router.post('/cart/red-qty',isAuth,userController.postReduceQty);

router.post('/cart/inc-qty',isAuth,userController.postIncreaseQty);

module.exports=router;

