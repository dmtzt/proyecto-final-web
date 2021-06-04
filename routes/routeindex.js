const { render } = require('ejs');
const express = require('express');
const router = express.Router();
//const Task = require('../model/task');

router.get('/', async function(req,res){
  res.render('index');
});

module.exports = router;