const { render } = require('ejs');
const express = require('express');
const router = express.Router();
//const Task = require('../model/task');
//const { MongoClient } = require("mongodb");
const bcrypt = require ("bcryptjs");
const mongoose = require('mongoose');
const passport = require("passport");
//const axios = require('axios');
const https = require('https');
require("dotenv").config();
require('../config/passport')(passport);

const User = require("../models/User");
const Tournament = require("../models/Tournament");


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

//mongoose.set('useCreateIndex', true)

// Main route
router.get('/', async function (req,res) {
  // TODO
  res.render('welcome');
});

router.get('/sign-up', async function (req,res) {
  // TODO
  res.render('sign-up');
});

router.get('/log-in', async function (req,res) {
  // TODO
  res.render('sign-in');
});

router.get('/about-us', async function (req,res) {
  // TODO
  res.render('about-us');
});

// Sign-in get and post routes
router.get('/home', (req, res) => {
  // TODO
  //console.log(req.user);
  if (typeof req.user == "undefined"){
    res.render('index');
  }else{
    var name = req.user.name;
    var tournaments =[];
    var isPresent= [];
    console.log(req.user);
    Tournament.find({}, function (err, data){
      data.forEach(function(value){
        console.log("-------------");
        console.log(value);
        console.log("-------------");
        if (!value.isPrivate){
          tournaments.push(value);
          console.log("PROBANDO"); // arreglo que contiene valores true y false,
                                    // dependiendo de si el usuario esta presente en el torneo o no
          console.log(value.users.includes(req.user.userID));
          if (value.users.includes(req.user.userID)){
            isPresent.push(true);
          }
          else{
            isPresent.push(false);
          }
        }
      });
      console.log(tournaments);
      console.log(isPresent);
    res.render('f-main', {name, tournaments, currentUser: req.user.userID, isPresent});
    });
  }
});

router.post('/home', (req, res, next) => {
  passport.authenticate("local",{
    successRedirect: "/home", 
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
  var errors = [];
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
    res.render("index", {errors});
    console.log(errors);
  }
  else{
    User.findOne(
      // busca que el ID del usuario sea unico y que no tenga la cuenta de correo ya registrada
    {
      $or: [
        { userID : userID_register },
        { email: email_register }
      ]
    }
      ).then(user =>{
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
            req.login(newUser, function(err) {
              if (err) {
                console.log(err);
              }
              return res.redirect('/home');
            });
          } ))
        console.log("---------------");
        console.log(newUser);
        console.log("---------------");
       // res.redirect(307, "/home");

        // falta redirigir a pagina principal
      }
    });
  }
});

// Tournaments routes

// CREATE TOURNAMENT

router.get('/createT', (req, res) => {
  if (typeof req.user == "undefined"){
    res.render("index");
  }
  else{
  var name = req.user.name;
  res.render('t-create', {name});
  }
});


router.post('/createT', async function (req, res) {
  var {name, description, isPrivate} = req.body;
  var isPrivateBool = false;
  if (isPrivate == "on"){
    isPrivateBool = true;
  }
  const newTournament = new Tournament({
    name: name,
    description: description,
    owner: req.user.userID,
    isPrivate: isPrivateBool,
    users: req.user.userID
  });
  await newTournament.save();
  res.redirect(req.baseUrl + "/home");
});

// All tournaments
router.get('/t', (req, res) => {
  const tournaments_per_row = 3;
  var tournaments = [];

  var tournament = new Tournament ({
    name: "Torneo",
    description: "Descripción del torneo",
    owner: "David",
    users: [],
    isPrivate: false
  });

  tournaments.push(tournament);
  tournaments.push(tournament);
  tournaments.push(tournament);
  tournaments.push(tournament);

  //console.log(tournaments.length % tournaments_per_row);
  //const path = require('path');
  //console.log(path.join(__dirname, '/public'));

  res.render('t-main', {tournaments, tournaments_per_row});
});

// Single tournament by id
router.get('/t/:id',  async function (req, res) {
  var id = req.params.id;
  console.log("id received is " + id);

  var tournamentSingle = await Tournament.findById(id, (err, data) => {
    console.log("asklaml");
});
  console.log(tournamentSingle);
  if (typeof req.user == "undefined"){
    res.render("index");
  }
  else{
    var uID = req.user.userID;
    if (uID === tournamentSingle.owner){
      res.render('t-single', {tournamentSingle, isOwner: true, currentUser: req.user.userID});
    }
    else{
    res.render('t-single', {tournamentSingle, isOwner: false, currentUser: req.user.userID});
    }
  }
});

// Delete user from tournament
router.post('/t/:id/delete/:uID',  async function (req, res) {
  var id = req.params.id;
  var uID = req.params.uID;
  console.log("id received is " + id);
  console.log("user id received is " + uID);

  await Tournament.findById(id).updateOne({
    $pull: {
      users: {
        $in: [uID]
      }
    }
  }).then(
    res.redirect(req.baseUrl + "/t/" + id)
  );
  res.end();
  
});

// Join a tournament
router.post('/t/:id/join', async function (req, res) {
  // TODO
  if (typeof req.user == "undefined"){
    res.render("index");
  }
  else{
  var userID = req.user.userID;
  var id = req.params.id;
  console.log("id received for updating register is " + id);

  var isPresent = await Tournament.findById(id).find({
    users: {"$in": [userID]}
  });

  console.log(isPresent);

  if (JSON.stringify(isPresent) === '[]'){
    await Tournament.findById(id).updateOne(
      { $push: { users: userID } }
    );
  } else{
    console.log("User is already present");
  };
  
  var tournamentSingle = await Tournament.findById(id, (err, data) => {
    console.log("tournament retrieved");
  });
  res.render('t-single', {tournamentSingle, isOwner: false, currentUser: req.user.userID});
  }
});


// delete tournament
router.post('/t/:id/deleteT', async function (req, res) {
  var id = req.params.id;
  console.log("id of tournament to be deleted received is " + id);
  await Tournament.findById(id).remove().then(
    res.redirect(req.baseUrl + "/home/")
  );
});

// My account
router.get('/myAccount', async function (req, res) {
  if (typeof req.user == "undefined"){
    res.render("index");
  }
  else{
    var user = req.user;
    var tournaments = [];
    var tournamentsParticipant = [];

    await Tournament.find({owner: req.user.userID}, function (err, data){
      data.forEach(function(value){
        tournaments.push(value);
        console.log("TOURNAMENT FOUND: - --  - -- - - -");
        console.log(value);
      });
    });

    await Tournament.find({
      users: {"$in": [req.user.userID]}
    }, function(err, data){
      data.forEach(function (value){
        tournamentsParticipant.push(value);
      });
    });

    res.render('my-account', {user, tournaments, tournamentsParticipant});
  }
});

// SEARCH 
router.get('/q/:search', async function (req, res) {
  if (typeof req.user == "undefined"){
    res.render("index");
  }
  else{
  var search = req.params.search;
  var user = req.user;
  console.log("search received is " + search);
  var tournaments = [];
  var regexQuery = {
    $or: [
    {name: new RegExp(search, 'i')},
    {description: new RegExp(search, 'i')}
    ]
  };

  //Tournament.createIndexes({ "$**": "text" });

  
  await Tournament.find(
    regexQuery, function (err, data){
      console.log("ENCONTRADO");
      console.log(data);
      
    data.forEach(function(value){
      tournaments.push(value);
      console.log("TOURNAMENT FOUND IN SEARCH BAR: - --  - -- - - -");
      console.log(value);
    });
  });
  
  res.render("search-results", {user, tournaments})
  }
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

router.get('/logout', (req,res) => {
  
  req.session.destroy(function (err) {
    console.log("supposedly logged out");
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});

// router.get('*', (req,res) => {
//   req.session.destroy(function (err) {
//     console.log("supposedly logged out");
//     res.redirect('/'); //Inside a callback… bulletproof!
//   });
// });

//Rutas para ver a otros usuarios
router.get('/u/:id',  async function (req, res) {
  var id = req.params.id;
  console.log("id received is " + id);

  var userFound = await User.find({userID: id}, (err, data) => {
    console.log("user found");
});


console.log("USER FOUND: ")
  console.log(userFound);
  console.log(userFound[0].name);

  var tournaments = [];
  var tournamentsParticipant = [];

    await Tournament.find({owner: id}, function (err, data){
      data.forEach(function(value){
        tournaments.push(value);
        console.log("TOURNAMENT FOUND: - --  - -- - - -");
        console.log(value);
      });
    });

    await Tournament.find({
      users: {"$in": [req.user.userID]}
    }, function(err, data){
      data.forEach(function (value){
        tournamentsParticipant.push(value);
      });
    });

  if (typeof req.user == "undefined"){
    res.render("index");
  }
  else{
    var uID = req.user.userID;
    var user = req.user;
    if (uID === id){
      res.render('my-account', {user, tournaments, tournamentsParticipant});
    }
    else{
    res.render('another-acc', {userFound, tournaments});
    }
  }
});

module.exports = router;