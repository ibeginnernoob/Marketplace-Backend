//packages
const path = require('path');
const fs=require('fs');

const express=require('express');
const bodyParser=require('body-parser');
const mongodb=require('mongodb');
const mongoose=require('mongoose');
const session=require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session);
const csrf=require('csurf');
const userAgent=require('express-useragent');

//hosting packages
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');

//models
const User=require('./models/user');

//routes
const shopRoutes=require('./routes/shop');
const adminRoutes=require('./routes/admin');
const authRoutes=require('./routes/auth');
const userRoutes=require('./routes/user');

//package implementations
const MONGODB_URI=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rblysmw.mongodb.net/${process.env.MONGO_DATABASE}?w=majority&appName=${process.env.MONGO_CLUSTER}`;

let mobileUser;
let desktopUser;

const app=express();
const csrfProtection=csrf();


const store=new MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
});

const accessLogControl=fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogControl}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use(session({secret:'do not reveal publicly',resave:false,saveUninitialized:false,store:store}));
app.use(csrfProtection);
app.use(userAgent.express());

app.use((req,res,next)=>{
    mobileUser=req.useragent.isMobile;
    desktopUser=req.useragent.isDesktop;
    next();
})

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn || false;
    res.locals.isAdmin=req.session.isOwnerEmail || false;
    res.locals.csrfToken=req.csrfToken();
    res.locals.isMobileUser=req.useragent.isMobile;
    res.locals.isDesktopUser=req.useragent.isDesktop;
    next();
});

app.use((req,res,next)=>{
    if(!req.session.user)
    {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user=>{
            if(!user){
                return next();
            }
            req.user=user;
            next();        
        })
        .catch(err=>{
            console.log(err);
        })
});

app.use(shopRoutes);
app.use('/admin',adminRoutes);
app.use(authRoutes);
app.use(userRoutes);

//error routes
app.use((req,res,next)=>{
    if(res.locals.isMobileUser){
        res.render('mobile/errors/404-mobile.ejs',{
            docTitle:'Error 404'
        });
    }
    if(res.locals.isDesktopUser){
        res.render('errors/404.ejs',{
            docTitle:'Error 404'
        });
    }
});

app.use((error,req,res,next)=>{
    console.log(error);
    if(mobileUser){
        res.render('mobile/errors/500-mobile.ejs',{
            docTitle:'Error 500'
        });
    }
    else if(desktopUser){
        res.render('errors/500.ejs',{
            docTitle:'Error 500'
        });
    }
});

mongoose.connect(MONGODB_URI)
    .then(result=>{
        app.listen(process.env.PORT || 3000);
    })
    .catch(err=>console.log(err))