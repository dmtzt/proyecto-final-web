const { render } = require('ejs');
const express = require('express');
const router = express.Router();
//const Task = require('../model/task');
//const { MongoClient } = require("mongodb");
const bcrypt = require ("bcryptjs");
const mongoose = require('mongoose');
const passport = require("passport");
require("dotenv").config();
require('../config/passport')(passport);

const User = require("../models/User");


// torneos is the name of the db
// collections:
//  - users
//  - tournaments
const uri = process.env.URISTRING;
//const client = new MongoClient(uri);

mongoose.connect(uri,{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
  .then(db => console.log('db connected'))
  .catch(err => console.log(err));

// Main route
router.get('/', async function (req,res) {
  // TODO
  res.render('index');
});

// Sign-in get and post routes
router.get('/sign-in', (req, res) => {
  // TODO
  //console.log(req.user);
  if (typeof req.user == "undefined"){
    res.render('index');
  }else{
    var name = req.user.name
    console.log(req.user);
    res.render('f-main', {name});
  }
});

router.post('/sign-in', (req, res, next) => {
  passport.authenticate("local",{
    successRedirect: "/sign-in", 
    failureRedirect: "/"
  })(req, res, next);
  //res.render('index');
});

// Sign-up get and post routes
router.get('/sign-up', (req, res) => {
  // TODO
  res.render('sign-up');
});

router.post('/sign-up', (req, res) => {
  // TODO
  const {email_register, password_register, password2_register, name_register, userID_register} = req.body;

  if (!email_register || !password_register || !name_register || !userID_register || !password2_register){
    errors.push({ msg: "Please fill in all fields"})
  }
  if (password_register !== password2_register){
    errors.push({ msg: "Passwords do not match"})
  }
  if (password_register.length < 6){
    errors.push({ msg: "Passwords should be at least 6 characters long"})
  }
  if (errors.length > 0){
    //res.render("index", {errors});
    console.log(errors);
  }
  else{
    User.findOne({email: email_register}).then(user =>{
      if (user){ // el usuario ya esta registrado
        console.log("Ya esta registrado lol");
      }
      else{
        const newUser = new User({
          userID: userID_register,
          name: name_register,
          email: email_register,
          password: password_register
        });
        // Hash
        bcrypt.genSalt(10, (errl, salt) => 
          bcrypt.hash(newUser.password, salt, (err, hash) =>{
            if (err) throw err;
            // set password to hash
            newUser.password = hash;
            newUser.save()
            .then(console.log("EXITO"))
            .catch(err => console.log(err));
          } ))
        console.log("---------------");
        console.log(newUser);
        console.log("---------------");



      }
    });
  }


  res.render('index');
});

// Tournaments routes
// All tournaments
router.get('/t', (req, res) => {
  res.render('t-main');
});

// Single tournament by id
router.get('/t/:id', (req, res) => {
  var id = req.params.id;
  res.render('t-single');
});

// Join a tournament
router.post('/t/:id/join', (req, res) => {
  // TODO
  var id = req.params.id;
  res.render('t-single');
});

// Forums routes
// All forums
router.get('/f', (req, res) => {
  res.render('f-main');
});

// Single forum page by videogame name
router.get('/f/:name', (req, res) => {
  var name = req.params.name;
  res.render('f-main');
});

// Single post in forum
router.get('/f/:name/posts/:post_id', (req, res) => {
  var name = req.params.name;
  var post_id = req.params.post_id;
  res.render('f-main');
});

// Create videogame forum
router.post('/f', (req, res) => {
  res.render('f-main');
})

// Create post in videogame forum
router.post('/f/:name/posts/', (req, res) => {
  var name = req.params.name;
  res.render('f-main');
});

router.get('*', (req,res) => {
  res.render('index');
});

router.get('/logout', (req,res) => {
  req.logout();
  console.log("supposedly logged out");
  res.render('/');
});

module.exports = router;