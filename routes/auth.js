const express=require('express');
const {body}=require('express-validator');
const bcrypt=require('bcryptjs');

const User=require('../models/user');

const authController=require('../controllers/auth');
const isAuth=require('../middlewares/is-auth').isAuth;

const router=express.Router();

//laptop routes

router.get('/laptop/login',authController.getLogin);

router.post('/laptop/login',[
    body('email').custom((value,{req})=>{
        return User.findOne({
            email:value
        })
            .then(user=>{
                if(!user){
                    return Promise.reject("Sorry we couldn't find a user with that email address.")
                }
            })
    }),
    body('password').custom((value,{req})=>{
        return User.findOne({
            email:req.body.email
        })
            .then(user=>{
                if(!user){
                    return false
                }
                return bcrypt.compare(value,user.password)
            })
            .then(doMatch=>{
                if(!doMatch){
                    return Promise.reject('Incorrect Password.')
                }
            })
    })
],authController.postLogin);

router.get('/laptop/signup',authController.getSignup);

router.post('/laptop/signup',[
    body('email').normalizeEmail({ gmail_remove_dots: false }).isEmail().withMessage('Not a valid Email Id.'),
    body('email').custom((value,{req})=>{
        return User.findOne({
            email:value
        })
            .then(user=>{
                if(user){
                    return Promise.reject('An account with that email already exists. Please log in instead.')
                }
            })
    }),
    body('password').custom((value,{req})=>{
        if(value!==req.body.confirmPassword){
            throw new Error('Password and confirm Password input do not match. User creation failed.')
        }
        else{
            return true;
        }
    })
],authController.postSignup);

//mobile routes

router.get('/mobile/login',authController.getMobileLogin);

router.post('/mobile/login',[
    body('email').custom((value,{req})=>{
        return User.findOne({
            email:value
        })
            .then(user=>{
                if(!user){
                    return Promise.reject("Sorry we couldn't find a user with that email address.")
                }
            })
    }),
    body('password').custom((value,{req})=>{
        return User.findOne({
            email:req.body.email
        })
            .then(user=>{
                if(!user){
                    return false
                }
                return bcrypt.compare(value,user.password) 
            })
            .then(doMatch=>{
                if(!doMatch){
                    return Promise.reject('Incorrect Password.')
                }
            })
    })
],authController.postMobileLogin);

router.get('/mobile/signup',authController.getMobileSignup);

router.post('/mobile/signup',[
    body('email').normalizeEmail({ gmail_remove_dots: false }).isEmail().withMessage('Not a valid Email Id.'),
    body('email').custom((value,{req})=>{
        return User.findOne({
            email:value
        })
            .then(user=>{
                if(user){
                    return Promise.reject('An account with that email already exists. Please log in instead.')
                }
            })
    }),
    body('password').custom((value,{req})=>{
        if(value!==req.body.confirmPassword){
            throw new Error('Password and confirm Password input do not match. User creation failed.')
        }
        else{
            return true;
        }
    })
],authController.postMobileSignup);

router.post('/logout',isAuth,authController.postLogout);//common route

module.exports=router;