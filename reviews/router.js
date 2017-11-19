const express = require('express');
const bodyParser = require('body-parser');

const {Review} = require('./models');
const router = express.Router();

const jsonParser = bodyParser.json();


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
  const requiredFields = ['rating', 'user'];

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

  // Review.find({
  //   user: req.review._id
  // })

})

module.exports = {router};
