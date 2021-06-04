const { render } = require('ejs');
const express = require('express');
const router = express.Router();
//const Task = require('../model/task');

// Main route
router.get('/', (req,res) => {
  // TODO
  res.render('index');
});

// Sign-in get and post routes
router.get('/sign-in', (req, res) => {
  // TODO
  res.render('sign-in');
});

router.post('sign-in', (req, res) => {
  // TODO
  res.render('index');
});

// Sign-up get and post routes
router.get('/sign-up', (req, res) => {
  // TODO
  res.render('sign-up');
});

router.post('/sign-up', (req, res) => {
  // TODO
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

module.exports = router;