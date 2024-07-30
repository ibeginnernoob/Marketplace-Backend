const User=require('../models/user');

//laptop controllers

exports.getCart=(req,res,next)=>{
    let totalCartItems=0;
    for(let i=0;i<req.user.cart.length;i++){
        totalCartItems+=1;
    }
    User.findById(req.user._id).populate('cart.product')
        .then(populatedUser=>{
            res.render('user/cart.ejs',{
                docTitle:'Your Cart',
                userCart:populatedUser.cart,
                totalCartItems:totalCartItems
            })
        })
        .catch(err=>{
            next(err);
        })
}

exports.postAddToCartFromShop=(req,res,next)=>{
    const productId=req.body.productId;
    let count=0;
    req.user.cart.forEach(item=>{
        if(item.product.toString()===productId.toString()){
            item.qty+=1;
            return item;
        }
        else{
            count+=1;
            return item;
        }
    })
    if(count===req.user.cart.length){  //count checks if product is already added in cart or not.
        req.user.cart.push({
            product:productId,
            qty:1
        })
    }
    req.user.save()
        .then(result=>{
            res.redirect('/laptop/cart');
        })
        .catch(err=>{
            next(err);
        })
}

exports.postAddToCartFromSearch=(req,res,next)=>{
    const productId=req.body.productId;
    let count=0;
    req.user.cart.forEach(item=>{
        if(item.product.toString()===productId.toString()){
            item.qty+=1;
            return item;
        }
        else{
            count+=1;
            return item;
        }
    })
    if(count===req.user.cart.length){  //count checks if product is already added in cart or not.
        req.user.cart.push({
            product:productId,
            qty:1
        })
    }
    req.user.save()
        .then(result=>{
            res.redirect('/laptop/cart');
        })
        .catch(err=>{
            next(err);
        })
}

exports.getWishlist=(req,res,next)=>{
    User.findById(req.user._id).populate('wishlist.product')
        .then(populatedUser=>{
            console.log(populatedUser.wishlist)
            res.render('user/wishlist.ejs',{
                docTitle:'Your Wishlist',
                userWishlist:populatedUser.wishlist,
            })
        })
        .catch(err=>{
            next(err);
        })
}

//common controllers

exports.postAddToWishlist=(req,res,next)=>{
    const productId=req.body.productId;
    let count=0;
    req.user.wishlist.map(item=>{
        if(item.product.toString()===productId.toString()){
            return item;
        }
        count+=1;
        return item;
    })
    if(count===req.user.wishlist.length){
        req.user.wishlist.push({
            product:productId
        })
    }
    req.user.save()
        .then(result=>{
            console.log('Product successfully added to Wishlist!');
            if(res.locals.isDesktopUser){
                res.redirect('/laptop/wishlist');
            }
            else if(res.locals.isMobileUser){
                res.redirect('/mobile/wishlist');
            }
        })
        .catch(err=>{
            next(err);
        })
}

exports.postRemoveFromWishlist=(req,res,next)=>{
    const productId=req.body.productId;
    req.user.wishlist=req.user.wishlist.filter(item=>{
        return item.product.toString()!==productId.toString();
    })
    req.user.save()
        .then(result=>{
            console.log('Product successfully removed from Wishlist')
            if(res.locals.isDesktopUser){
                res.redirect('/laptop/wishlist');
            }
            else if(res.locals.isMobileUser){
                res.redirect('/mobile/wishlist');
            }
        })
        .catch(err=>{
            next(err);
        })
}

exports.postAddToCartFromDetails=(req,res,next)=>{
    const productId=req.body.productId;
    const qty=req.body.qty;
    let count=0;
    req.user.cart.forEach(item=>{
        if(item.product.toString()===productId.toString()){
            item.qty=qty;
            return item;
        }
        else{
            count+=1;
            return item;
        }
    })
    if(count===req.user.cart.length){  //count checks if roduct is already added in cart or not.
        req.user.cart.push({
            product:productId,
            qty:qty
        })
    }
    req.user.save()
        .then(result=>{
            if(res.locals.isDesktopUser){
                res.redirect('/laptop/cart');
            }
            else if(res.locals.isMobileUser){
                res.redirect('/mobile/cart');
            }
        })
        .catch(err=>{
            next(err);
        })
}

exports.postAddToCartFromWishlist=(req,res,next)=>{
    const productId=req.body.productId;
    let count=0;
    req.user.cart.forEach(item=>{
        if(item.product.toString()===productId.toString()){
            return item;
        }
        else{
            count+=1;
            return item;
        }
    })
    if(count===req.user.cart.length){  //count checks if roduct is already added in cart or not.
        req.user.cart.push({
            product:productId,
            qty:1
        })
    }
    req.user.save()
        .then(result=>{
            if(res.locals.isDesktopUser){
                res.redirect('/laptop/cart');
            }
            else if(res.locals.isMobileUser){
                res.redirect('/mobile/cart');
            }
        })
        .catch(err=>{
            next(err);
        })
}

exports.postRemoveFromCart=(req,res,next)=>{
    const productId=req.body.productId;
    req.user.cart=req.user.cart.filter(item=>{
        return item.product.toString()!==productId.toString();
    })
    req.user.save()
        .then(result=>{
            if(res.locals.isDesktopUser){
                res.redirect('/laptop/cart');
            }
            else if(res.locals.isMobileUser){
                res.redirect('/mobile/cart');
            }
        })
        .catch(err=>{
            next(err);
        })
}

exports.postReduceQty=(req,res,next)=>{
    const productId=req.body.productId;
    req.user.cart = req.user.cart.filter(item => {
        if (item.product.toString() === productId.toString()) {
            if (item.qty > 1) {
                item.qty -= 1;
                return item;
            } 
            else {
                return null;
            }
        }
        return item;
    });
    req.user.save()
        .then(result=>{
            if(res.locals.isDesktopUser){
                res.redirect('/laptop/cart');
            }
            else if(res.locals.isMobileUser){
                res.redirect('/mobile/cart');
            }
        })
        .catch(err=>{
            next(err);
        })
}

exports.postIncreaseQty=(req,res,next)=>{
    const productId=req.body.productId;
    req.user.cart.forEach(item => {
        if(item.product.toString()===productId.toString()){
            item.qty+=1;
            return item;
        }
        return item
    });
    req.user.save()
        .then(result=>{
            if(res.locals.isDesktopUser){
                res.redirect('/laptop/cart');
            }
            else if(res.locals.isMobileUser){
                res.redirect('/mobile/cart');
            }
        })
        .catch(err=>{
            next(err);
        })
}

//mobile controllers

exports.getMobileCart=(req,res,next)=>{
    let totalCartItems=0;
    for(let i=0;i<req.user.cart.length;i++){
        totalCartItems+=1;
    }
    User.findById(req.user._id).populate('cart.product')
        .then(populatedUser=>{
            res.render('mobile/user/cart-mobile.ejs',{
                docTitle:'Your Cart',
                userCart:populatedUser.cart,
                totalCartItems:totalCartItems
            })
        })
        .catch(err=>{
            next(err);
        })
}

exports.getMobileWishlist=(req,res,next)=>{
    User.findById(req.user._id).populate('wishlist.product')
        .then(populatedUser=>{
            res.render('mobile/user/wishlist-mobile.ejs',{
                docTitle:'Your Wishlist',
                userWishlist:populatedUser.wishlist,
            })
        })
        .catch(err=>{
            next(err);
        })
}