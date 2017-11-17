const express = require('express');
const bodyParser = require('body-parser');

const {Review} = require('./models');
const router = express.Router();

const jsonParser = bodyParser.json();




router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['rating', 'userID'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing Field',
      location: missingField
    })
  }

  // Review.find({
  //   userID: req.review._id
  // })

})

module.exports = {router};