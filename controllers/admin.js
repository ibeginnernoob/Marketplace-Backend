const fs = require('fs');
const path = require('path');

const Product=require('../models/product');
const User=require('../models/user');

exports.getAddAdminProduct=(req,res,next)=>{
    res.render('admin/add-product.ejs',{
        docTitle:'Add Product'
    });
}

exports.postAddAdminProduct=(req,res,next)=>{
    const productType=req.body.productType;
    const productTitle=req.body.productTitle;
    const productDescription=req.body.productDescription;
    const productImageURL1=`/images/${req.files.productImage1[0].filename}`;
    const productImageURL2=`/images/${req.files.productImage2[0].filename}`;
    const productImageURL3=`/images/${req.files.productImage3[0].filename}`;
    const productImageURL4=`/images/${req.files.productImage4[0].filename}`;
    const productImageURL5=`/images/${req.files.productImage5[0].filename}`;
    const productPrice=req.body.productPrice;
    const cancelledProductPrice=req.body.cancelledProductPrice;
    const productKeywords=req.body.productKeywords;
    let imageURLs=[];
    imageURLs.push(productImageURL1,productImageURL2,productImageURL3,productImageURL4,productImageURL5);
    let keywords=productKeywords.split(/\s*,\s*/);
    const newAdminProduct=new Product({
        type:productType,
        title:productTitle,
        description:productDescription,
        imageURL:imageURLs,
        price:productPrice,
        cancel_price:cancelledProductPrice,
        keywords_id:keywords,
        in_shop:false
    });
    newAdminProduct.save()
        .then(result=>{
            res.redirect('/admin/admin-products');
        })
        .catch(err=>{
            next(err);
        })
}

exports.adminProducts=(req,res,next)=>{
    let inShopTrue=[];
    let inShopFalse=[];
    Product.find({})
        .then(products=>{
            inShopTrue=products.filter(p=>{
                return p.in_shop===true
            });
            inShopFalse=products.filter(p=>{
                return p.in_shop===false
            });
            const inShopTrueObj=inShopTrue.reduce((acc,obj)=>{
                const { type }=obj;
                if(!acc[type])
                {
                    acc[type]=[];
                }
                acc[type].push(obj);
                return acc;
              },{});
              const inShopFalseObj=inShopFalse.reduce((acc,obj)=>{
                const { type }=obj;
                if(!acc[type])
                {
                    acc[type]=[];
                }
                acc[type].push(obj);
                return acc;
              },{});
            res.render('admin/admin-products.ejs',{
                docTitle:'Admin Products',
                inShopProductsObj:inShopTrueObj,
                notInShopProductsObj:inShopFalseObj
            })
        })
        .catch(err=>{
            next(err);
        })
}

exports.addToShop=(req,res,next)=>{
    const productId=req.body.productId;
    Product.findById(productId)
        .then(product=>{
            if(!product){
                const err=new Error('Product not found!');
                next(err);
            }
            return product.updateOne({
                in_shop:true
            })
        })
        .then(result=>{
            console.log('Product successfully added to Shop!');
            res.redirect('/admin/admin-products');
        })
        .catch(err=>{
            next(err);
        })
}

exports.removeFromShop=(req,res,next)=>{
    const productId=req.body.productId;
    Product.findById(productId)
        .then(product=>{
            if(!product){
                const err=new Error('Product not found!');
                next(err);
            }
            return product.updateOne({
                in_shop:false
            })
        })
        .then(result=>{
            return User.find({
                'cart': {
                  $elemMatch: { product: productId }
                }
            });
        })
        .then(users=>{
            users.forEach(user=>{
                user.cart=user.cart.filter(item=>{
                    return item.product.toString()!==productId.toString();
                })
            });
            const bulkOps=users.map(user => ({
                updateOne: {
                    filter: { _id: user._id },
                    update: { $set: { cart: user.cart } },
                    upsert: false
                }
            }));
            return User.bulkWrite(bulkOps);
        })
        .then(result=>{
            console.log('Product successfully removed from Shop!');
            res.redirect('/admin/admin-products');
        })
        .catch(err=>{
            next(err);
        })
}

exports.deleteProduct=async(req,res,next)=>{
    try{
        const productId=req.body.productId;
        const product=await Product.findById(productId);
        if(!product){
            const err=new Error('Product not found!');
            next(err);
        }
        const deletedProduct=await product.deleteOne()
        const users=User.find({
            'cart': {
            $elemMatch: { product: productId }
            }
        });
        users.forEach(user=>{
            user.cart=user.cart.filter(item=>{
                return item.product.toString()!==productId.toString();
            })
            user.wishlist=user.wishlist.filter(item=>{
                return item.product.toString()!==productId.toString();
            })
        });
        const bulkOps=users.map(user => ({
            updateOne: {
                filter: { _id: user._id },
                update: { $set: { cart: user.cart, wishlist: user.wishlist } },
                upsert: false
            }
        }));
        const result=User.bulkWrite(bulkOps);
        console.log('Product successfully deleted!');
        res.redirect('/admin/admin-products');
    }
    catch(err){
        next(err);
    }
}

exports.getEditProduct=(req,res,next)=>{
    const productId=req.params.productId;
    Product.findById(productId)
        .then(product=>{
            if(!product){
                const err=new Error('Product not found!');
                next(err);
            }
            res.render('admin/edit-product.ejs',{
                docTitle:'Edit Product',
                product:product
            })
        })
        .catch(err=>{
            next(err);
        })
}

exports.postEditProduct=(req,res,next)=>{
    console.log(req.files);
    const productId=req.body.productId;
    const productType=req.body.productType;
    const productTitle=req.body.productTitle;
    const productDescription=req.body.productDescription;
    const productImage1=req.files.productImage1;
    const productImage2=req.files.productImage2;
    const productImage3=req.files.productImage3;
    const productImage4=req.files.productImage4;
    const productImage5=req.files.productImage5;
    const productPrice=req.body.productPrice;
    const cancelledProductPrice=req.body.cancelledProductPrice;
    const productKeywords=req.body.productKeywords;
    let keywords=productKeywords.split(/\s*,\s*/);
    let imageURLs=[];
    Product.findById(productId)
        .then(async product=>{
            try{
                imageURLs.push(product.imageURL[0]);
                if(productImage1){
                    await deleteFile(product.imageURL[0]);
                    imageURLs.pop();
                    imageURLs.push(`/images/${productImage1[0].filename}`);
                }
                imageURLs.push(product.imageURL[1]);
                if(productImage2){
                    await deleteFile(product.imageURL[1]);
                    imageURLs.pop();
                    imageURLs.push(`/images/${productImage2[0].filename}`);
                }
                imageURLs.push(product.imageURL[2]);
                if(productImage3){
                    await deleteFile(product.imageURL[2]);
                    imageURLs.pop();
                    imageURLs.push(`/images/${productImage3[0].filename}`);
                }
                imageURLs.push(product.imageURL[3]);
                if(productImage4){
                    await deleteFile(product.imageURL[3]);
                    imageURLs.pop();
                    imageURLs.push(`/images/${productImage4[0].filename}`);
                }
                imageURLs.push(product.imageURL[4]);
                if(productImage5){
                    await deleteFile(product.imageURL[4]);
                    imageURLs.pop();
                    imageURLs.push(`/images/${productImage5[0].filename}`);
                }
                return product.updateOne({
                    type:productType,
                    title:productTitle,
                    description:productDescription,
                    imageURL:imageURLs,
                    price:productPrice,
                    cancel_price:cancelledProductPrice,
                    keywords_id:keywords
                })
            }
            catch(err){
                throw err;
            }
        })
        .then(result=>{
            console.log('Changes to the Product made successfully!');
            res.redirect('/admin/admin-products');
        })
        .catch(err=>{
            next(err);
        })
}

function deleteFile(filePath){
  return new Promise((resolve,reject)=>{
    const filename=filePath.split('/')[2];
    fs.unlink(path.join(__dirname,'..','images',filename),(err)=>{
      if(err){
        reject(err);
      } 
      else{
        resolve();
      }
    });
  });
}
