const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {Review} = require('../reviews/models');
const {Company} = require('../companies/models');
const {Drink} = require('./models');

const router = express.Router();


router.get('/', (req, res) => {
  return Drink.find()
    .populate("company")
    .populate("reviews")
    .deepPopulate("reviews.user")
    .then(drinks => res.json(drinks.map(drink => drink.apiRepr())))
    .catch(err => res.status(500).json({
      message: 'Internal3322 server error'
    }));
});

//get a drink
router.get('/:id', (req, res) => {
  return Drink
    .findById(req.params.id)
    .populate("company")
    .populate("reviews")
    .deepPopulate("reviews.user")
    .then(drink => res.json(drink.apiReprWithRating()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    })
});



router.post('/', (req, res) => {
  const requiredFields = ['name', 'type', 'company'];
  for(let field of requiredFields){
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message)
    }
  }
  let drink;
  Drink.create({
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    reviews: req.body.reviews,
    company: req.body.company
  })
  .then(_drink => {
    drink = _drink;
    return Company.findById(req.body.company);
  })
  .then(company => {
    company.drinks.push(drink.id);
    return company.save();
  })
  .then(company => {
    console.log("Successfully created a drink.");
    res.status(201).json(drink);
  })
  .catch(err => {
  	console.log("Error: ", err);
  	res.status(500).json({ error: 'Failed to create drink' });
  });
})



router.put('/:id', (req, res) => {

  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }

const toUpdate = {};
  const updateableFields = ['name', 'type', 'description', 'company', 'reviews'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Drink
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .exec()
    .then(drink => res.status(200).json(drink.apiRepr()))
    .catch(err => res.status(500).json({message: 'Failure to update drink'}));
});



router.delete('/:id', (req, res) => {

  Drink.remove({_id: req.params.id})
    .exec()
    .then(drink => {
      console.log("Successfully deleted drink.");
      res.status(204).send();
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(404).json({ error: 'Failed to delete drink' });
    })
})

module.exports = {router};
