const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {Drink} = require('../drinks/models');
const {Review} = require('./models');
const router = express.Router();

const jsonParser = bodyParser.json();

//Get ALL reviews
router.get('/', (req, res) => {
  return Review.find()
    .then(reviews => res.json(reviews.map(review => review.apiRepr())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
})


//Get one review
router.get('/:id', (req, res) => {
  return Review.findById(req.params.id)
    .then(review => res.json(review.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    })
})



/* authenticate user for the review */
router.post('/', jsonParser, passport.authenticate('jwt', {session: false}), (req, res) => {
  const requiredFields = ['rating', 'drink', 'title'];

  for(let field of requiredFields){
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message)
    }
  }

  let review;
  Review.create({
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
    price: req.body.price,
    purchased: req.body.purchased,
    flavors: req.body.flavors,
    user: req.user.id,
    drink: req.body.drink
  })
  .then(_review =>{
      review = _review;
      return Drink.findById(req.body.drink);
  })
  .then(drink => {
    drink.reviews.push(review.id);
    return drink.save();
  })
  .then(drink => {
    console.log("Sucessfully created a review.");
    res.status(201).json(review);
  })
  .catch(err => {
    console.log("Error: ", err);
    res.status(500).json({ error: 'Failed to create review' });
  })
})



router.put('/:id', (req, res) => {

  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`
    );
    console.error(message);
    return res.status(400).send(message);
  }
  const toUpdate = {};
    const updateableFields = ['rating', 'title', 'comment', 'price', 'purchased', 'flavors'];

    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });

    Review
      .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
      .exec()
      .then(review => res.status(200).json(review.apiRepr()))
      .catch(err => res.status(500).json({message: 'Failure to update review'}));
  });


router.delete('/:id', (req, res) => {
  //get the drink id from the review
  Review.findById({_id: req.params.id})
    .then(review => {
      let drinkId = review.drink;
      return Drink.findById(drinkId);
    })
    //delete the review Id from the drink
    .then(drink => {
      let index = drink.reviews.indexOf(req.params.id);
      drink.reviews.splice(index, 1);
      return drink.save();
    })
    .then(drink => {
      //delete from Review
      return Review.remove({_id: req.params.id})
    })
    .then(review => {
      console.log("Successfully deleted review.");
      return res.status(204).send();
    })
    .catch(err => {
      console.log("Error: ", err);
      return res.status(404).json({ error: 'Failed to delete review' });
    });
})


module.exports = {router};
