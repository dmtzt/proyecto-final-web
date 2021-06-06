const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require("passport");
require('./config/passport')(passport);




// Create app
var app = express();

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

//passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
const indexRoutes = require('./routes/routeindex');
app.use('/', indexRoutes);

// Settings: port, template engine
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
console.log(app.get('views'));
app.set('view engine', 'ejs');

// Middlewares: morgan, JSON parsing, static files (images, CSS files, JS files)
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use('/static', express.static(path.join(__dirname, 'public')));




// Start server
app.listen(app.get('port'), () => {
    console.log(`Server up in port: ${app.get('port')}`);
});