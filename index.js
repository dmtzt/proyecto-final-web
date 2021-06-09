const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require("passport");
var session = require('express-session');
var cookieParser = require('cookie-parser');
require('./config/passport')(passport);




// Create app
var app = express();

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));

//passport
app.use(passport.initialize());
app.use(passport.session());

// Settings: port, template engine
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
console.log(app.get('views'));
app.set('view engine', 'ejs');



// Routes
const indexRoutes = require('./routes/routeindex');
app.use('/', indexRoutes);

// Middlewares: morgan, JSON parsing, static files (images, CSS files, JS files)
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, '/public')));





// Start server
app.listen(app.get('port'), () => {
    console.log(`Server up in port: ${app.get('port')}`);
});