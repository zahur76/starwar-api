// Install all required modules
const express = require('express');
//session users
const session = require('express-session');
//flash messages
const flash = require('express-flash');
const errorhandler = require('errorhandler')

var morgan = require('morgan');
const app = express();

//environment variables
const dotenv = require('dotenv');
dotenv.config();


// Connect assets files, images,css and JS
const path = require('path');
app.use(express.static(__dirname + '/assets'));


// Set EJS templating engine
app.set('view engine', 'ejs');


// Middleware app
app.use(flash());
app.use(express.urlencoded({extended: true}))// extract form data
app.use(session({secret: process.env.secret,saveUninitialized: true,resave: true}));// initialise sess
app.use(morgan('short'))
app.use('/', (req, res, next) => { 
    sess = req.session;
    if(sess){
        sess=sess;
    }else{
        sess.username= null;  
        sess.password= null;
    }    
    console.log('using middleware');    
    next();
});
app.use(errorhandler())

//Export app
module.exports = app;
