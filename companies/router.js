const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {Company} = require('./models');

const router = express.Router();


router.get('/', (req, res) => {
  return Company.find()
    .then(companies => res.json(companies.map(company => company.apiRepr())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};


router.get('/:id', (req, res) => {
  return Company
    .findById(req.params.id)
    .exec() //!!!!explain!!!!
    .then(company => res.json(company.apiRepr())) //no render bc in component?
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

  //if key !exist in body is it automatically null???? or throw error?
  Company.create({
    name: req.body.name,
    streetAddress: req.body.streetAddress,
    city: req.body.city,
    state: req.body.state,
    hours: req.body.hours, // [ {open: 10, close: 18},{} ]
    imageUrl: req.body.imageUrl,
    types: req.body.types,
    drinks: req.body.drinks
  })
  .then(store => {
    console.log("Successfully created a company.");
    res.status(201).json(company.apiRepr()); //????
  })
  .catch(err => console.log("Error: ", err));
})
