const {validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');

const User=require('../models/user');

//laptop controllers

exports.getLogin=(req,res,next)=>{
    res.render('auth/login.ejs',{
        docTitle:'Log In',
        email:'',
        password:'',
        emailError:null,
        passwordError:null
    })
}

exports.postLogin=(req,res,next)=>{
    const errors=validationResult(req);
    const email=req.body.email;
    const password=req.body.password;
    if(!errors.isEmpty()){
        const errorsArray=errors.array();
        const emailErrors=errorsArray.filter(err=>{
            return err.path==='email';
        })
        const passwordErrors=errorsArray.filter(err=>{
            return err.path==='password';
        })
        return res.render('auth/login.ejs',{
            docTitle:'Log In',
            email:email,
            password:password,
            emailError:emailErrors[0],
            passwordError:passwordErrors[0]
        })
    }
    User.findOne({
        email:email
    })
        .then(user=>{
            req.session.user=user;
            req.session.isLoggedIn=true;
            req.session.isOwnerEmail=false;
            if(email==='adheilgupta@gmail.com'){
                req.session.isOwnerEmail=true;
            }
            return req.session.save(err=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/')
                }
            })
        })
        .catch(err=>{
            next(err);
        })
}

exports.getSignup=(req,res,next)=>{
    res.render('auth/signup.ejs',{
        docTitle:'Sign Up',
        email:'',
        password:'',
        emailError:null,
        passwordError:null
    })
}

exports.postSignup=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const errorsArray=errors.array();
        const emailErrors=errorsArray.filter(err=>{
            return err.path==='email';
        });
        const passwordErrors=errorsArray.filter(err=>{
            return err.path==='password';
        });
        if(errorsArray[0].path==='email' && errorsArray[0].msg==='An account with that email already exists. Please log in instead.'){
            return res.render('auth/signup.ejs',{
                docTitle:'Sign Up',
                email:email,
                password:'',
                emailError:emailErrors[0],
                passwordError:passwordErrors[0]
            }) 
        }
        return res.render('auth/signup.ejs',{
            docTitle:'Sign Up',
            email:'',
            password:'',
            emailError:emailErrors[0],
            passwordError:passwordErrors[0]
        })
    }
    bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const newUser=new User({
                email:email,
                password:hashedPassword
            });
            return newUser.save()
        })
        .then(result=>{
            console.log('New User successfully created.');
            req.session.user=result;
            req.session.isLoggedIn=true;
            req.session.isOwnerEmail=false;
            if(email==='adheilgupta@gmail.com'){
                req.session.isOwnerEmail=true;
            }
            return req.session.save(err=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/')
                }
            })
        })
        .catch(err=>{
            next(err);
        })
}

//common controllers

exports.postLogout=(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err){
            throw err;
        }
        else{
            res.redirect('/');
        }
    })
}

//mobile controllers

exports.getMobileLogin=(req,res,next)=>{
    res.render('mobile/auth/login-mobile.ejs',{
        docTitle:'Log In',
        email:'',
        password:'',
        emailError:null,
        passwordError:null
    })
}

exports.postMobileLogin=(req,res,next)=>{
    const errors=validationResult(req);
    const email=req.body.email;
    const password=req.body.password;
    if(!errors.isEmpty()){
        const errorsArray=errors.array();
        const emailErrors=errorsArray.filter(err=>{
            return err.path==='email';
        })
        const passwordErrors=errorsArray.filter(err=>{
            return err.path==='password';
        })
        return res.render('mobile/auth/login-mobile.ejs',{
            docTitle:'Log In',
            email:email,
            password:password,
            emailError:emailErrors[0],
            passwordError:passwordErrors[0]
        })
    }
    User.findOne({
        email:email
    })
        .then(user=>{
            req.session.user=user;
            req.session.isLoggedIn=true;
            req.session.isOwnerEmail=false;
            if(email==='adheilgupta@gmail.com'){
                req.session.isOwnerEmail=true;
            }
            return req.session.save(err=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/')
                }
            })
        })
        .catch(err=>{
            next(err);
        })
}

exports.getMobileSignup=(req,res,next)=>{
    res.render('mobile/auth/signup-mobile.ejs',{
        docTitle:'Sign Up',
        email:'',
        password:'',
        emailError:null,
        passwordError:null
    })
}

exports.postMobileSignup=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const errorsArray=errors.array();
        const emailErrors=errorsArray.filter(err=>{
            return err.path==='email';
        });
        const passwordErrors=errorsArray.filter(err=>{
            return err.path==='password';
        });
        if(emailErrors[0].path==='email' && emailErrors[0].msg==='An account with that email already exists. Please log in instead.'){
            return res.render('mobile/auth/signup-mobile.ejs',{
                docTitle:'Sign Up',
                email:email,
                password:'',
                emailError:emailErrors[0],
                passwordError:passwordErrors[0]
            })
        }
        return res.render('mobile/auth/signup-mobile.ejs',{
            docTitle:'Sign Up',
            email:'',
            password:'',
            emailError:emailErrors[0],
            passwordError:passwordErrors[0]
        })
    }
    bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const newUser=new User({
                email:email,
                password:hashedPassword
            });
            return newUser.save()
        })
        .then(result=>{
            console.log('New User successfully created.');
            req.session.user=result;
            req.session.isLoggedIn=true;
            req.session.isOwnerEmail=false;
            if(email==='adheilgupta@gmail.com'){
                req.session.isOwnerEmail=true;
            }
            return req.session.save(err=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/')
                }
            })
        })
        .catch(err=>{
            next(err);
        })
}