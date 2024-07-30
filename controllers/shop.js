const Product=require('../models/product');

//laptop controllers

exports.getShop=(req,res,next)=>{
    Product.find({
        in_shop:true
    })
        .then(products=>{
            const shop=products.reduce((acc,obj)=>{
                const { type }=obj;
                if(!acc[type])
                {
                    acc[type]=[];
                }
                acc[type].push(obj);
                return acc;
              },{});
            if(res.locals.isDesktopUser){
                res.render('shop/shop.ejs',{
                    docTitle:'Shop',
                    shop:shop
                });
            }
            else if(res.locals.isMobileUser){
                res.render('mobile/shop/shop-mobile.ejs',{
                    docTitle:'Shop',
                    shop:shop
                })
            }
        })
        .catch(err=>{
            next(err);
        })
};

exports.getLaptopProductDetails=(req,res,next)=>{
    const productId=req.params.productId;
    let productqty=1;
    if(req.user){
        req.user.cart.forEach(item => {
            if(item.product.toString()===productId.toString()){
                productqty=item.qty;
            }
        });
    }
    Product.findById(productId)
        .then(product=>{
            res.render('shop/productdetails.ejs',{
                docTitle:product.title,
                product:product,
                Qty:productqty
            })
        })
        .catch(err=>{
            next(err);
        })
}; 

exports.postSearchShop=(req,res,next)=>{
    const searched_string=req.body.searchBar;
    let searchKeywords=searched_string.split(' ');
    searchKeywords=searchKeywords.map(keyword=>keyword.toLowerCase());
    Product.find({
        keywords_id:{$all:searchKeywords}  //$all for comparing arrays with arrays in documents.
    })
        .then(products=>{
            const searchShopProducts=products.reduce((acc,obj)=>{
                const { type }=obj;
                if(!acc[type])
                {
                    acc[type]=[];
                }
                acc[type].push(obj);
                return acc;
              },{});
            res.render('shop/searchshop.ejs',{
                searchShopProducts:searchShopProducts,
                docTitle:searched_string+' - Cozy Colors',
                search_string:searched_string
            })
        })
}

//mobile controllers

exports.getMobileProductDetails=(req,res,next)=>{
    const productId=req.params.productId;
    let productqty=1;
    if(req.user){
        req.user.cart.forEach(item => {
            if(item.product.toString()===productId.toString()){
                productqty=item.qty;
            }
        });
    }
    Product.findById(productId)
        .then(product=>{
            res.render('mobile/shop/productdetails-mobile.ejs',{
                docTitle:product.title,
                product:product,
                Qty:productqty
            })
        })
        .catch(err=>{
            next(err);
        })
}

exports.getMobileSearchShop=(req,res,next)=>{
    res.render('mobile/shop/searchshop-mobile.ejs',{
        searchShopProducts:{},
        docTitle:'Search Shop - Cozy Colors',
        search_string:null
    })
}

exports.postMobileSearchShop=(req,res,next)=>{
    const searched_string=req.body.searchBar;
    let searchKeywords=searched_string.split(' ');
    searchKeywords=searchKeywords.map(keyword=>keyword.toLowerCase());
    Product.find({
        keywords_id:{$all:searchKeywords}  //$all for comparing arrays with arrays in documents.
    })
        .then(products=>{
            const searchShopProducts=products.reduce((acc,obj)=>{
                const { type }=obj;
                if(!acc[type])
                {
                    acc[type]=[];
                }
                acc[type].push(obj);
                return acc;
              },{});
            res.render('mobile/shop/searchshop-mobile.ejs',{
                searchShopProducts:searchShopProducts,
                docTitle:searched_string+' - Cozy Colors',
                search_string:searched_string
            })
        })
        .catch(err=>{
            next(err);
        })
}