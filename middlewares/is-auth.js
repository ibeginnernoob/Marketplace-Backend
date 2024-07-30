const User=require('../models/user');

exports.isAuth=(req,res,next)=>{
    if(!res.locals.isAuthenticated){
        if(res.locals.isDesktopUser){
            res.redirect('/laptop/login');
        }
        else if(res.locals.isMobileUser){
            res.redirect('/mobile/login');
        }
    }
    next();
}

exports.isAdmin=(req,res,next)=>{
    if(!res.locals.isAuthenticated || !res.locals.isAdmin){
        if(res.locals.isDesktopUser){
            res.redirect('/laptop/login');
        }
        else if(res.locals.isMobileUser){
            res.redirect('/mobile/login');
        }
    }
    next();
}