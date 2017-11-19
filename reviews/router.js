const express = require('express');
const bodyParser = require('body-parser');

const {Review} = require('./models');
const router = express.Router();

const jsonParser = bodyParser.json();

//Get ALL reviews
router.get('/', (req, res) => {
  return Review.find()
    .then(reviews => res.json(reviews.map(review => review.apiRepr())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
})

//Get all of the reviews written by a user
router.get('/', (req, res) => {
  // return Review.find()
  //   .then(reviews => res.json)
})


//Get all of the reviews for a drink
router.get('/', (req, res) => {

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




router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['rating'];//, 'user', 'drink'];

  //?????? why did this code not work instead of the for loops inside drinks and companies???
  // const missingField = requiredFields.find(field => !(field in req.body));
  //
  // if (missingField) {
  //   return res.status(422).json({
  //     code: 422,
  //     reason: 'ValidationError',
  //     message: 'Missing Field',
  //     location: missingField
  //   })
  // }

  for(let field of requiredFields){
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message)
    }
  }

  //TODO Fix trim()... if the keys aren't present trim throws error
  Review.create({
    rating: req.body.rating,
    title: req.body.title.trim(),
    comment: req.body.comment.trim(),
    price: req.body.price,
    purchased: req.body.purchased,
    flavors: req.body.flavors
    // user:
    //drink:
  })
  .then(review => {
    console.log("Sucessfully created a review.");
    res.status(201).json(review);
  })
  .catch(err => {
    console.log("Error: ", err);
    res.status(500).json({ error: 'something went terribly wrong' });
  })
})



module.exports = {router};
