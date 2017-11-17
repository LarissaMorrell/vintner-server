const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {Drink} = require('./models');

const router = express.Router();


router.get('/', (req, res) => {
  return Drink.find()
    .then(drinks => res.json(drinks.map(drink => drink.apiRepr())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};


router.get('/:id', (req, res) => {
  return Drink
    .findById(req.params.id)
    // .exec() //!!!!explain!!!!
    .then(drink => res.json(drink.apiRepr())) //no render bc in component?
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    })
});

router.post('/', (req, res) => {
  const requiredFields = ['name', 'streetAddress', 'city', 'state'];
  for(let field of requiredFields){
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message)
    }
  }
  console.log("in post req");
  //if key !exist in body is it automatically null???? or throw error?
  Drink.create({
    // name: req.body.name.trim(),
    })
  .then(store => {
    console.log("Successfully created a drink.");
    res.status(201).json(store); //????
  })
  .catch(err => console.log("Error: ", err));
})