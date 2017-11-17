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




router.get('/:id', (req, res) => {
  return Drink
    .findById(req.params.id)
    .then(drink => res.json(drink.apiRepr())) //no render bc in component?
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    })
});

router.post('/', (req, res) => {
  const requiredFields = ['name', 'type'];
  for(let field of requiredFields){
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message)
    }
  }

  Drink.create({
    name: req.body.name.trim(),
    type: req.body.type.trim(),
    reviews: req.body.reviews
  })	
  .then(drink => {
    console.log("Successfully created a drink.");
    res.status(201).json(drink);
  })
  .catch(err => {
  	console.log("Error: ", err);
  	res.status(500).json({ error: 'something went terribly wrong' });
  });
})

module.exports = {router};