const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
const bcrypt = require('bcrypt');
var routes = require('./routes');
const connection = require('./config/database').connection;
const modelName = require('./config/database').modelName;

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo');
const conn = process.env.DB_STRING;
const secret = process.env.SECRET;


/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();
require('./config/passport'); //има папка config с passport.js

// Create the Express application
var app = express();

app.use(express.json()); //вместо bodyParser
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */
const sessionStore = MongoStore.create({
	mongoUrl: conn, 
    collectionName: 'modelnames',
    mongoOptions: {useUnifiedTopology:true}
    //Other options. See docs.
});
app.use(session({
    secret: secret,
    resave: false,
    //TEST true
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 *60*60*24
    }
}))


/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
// Need to require the entire Passport config module so app.js knows about it
require('./config/passport'); //има папка config с passport.js
app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000, ()=>{
    console.log(`listening to port 3000.`)
});



