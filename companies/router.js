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




router.get('/:id', (req, res) => {
  return Company
    .findById(req.params.id)
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

  Company.create({
    name: req.body.name.trim(),
    streetAddress: req.body.streetAddress.trim(),
    city: req.body.city.trim(),
    state: req.body.state.trim(),
    hours: req.body.hours, // [ {open: 10, close: 18},{} ]
    imageUrl: req.body.imageUrl.trim(),
    types: req.body.types,
    drinks: req.body.drinks
  })
  .then(company => {
    console.log("Successfully created a company.");
    res.status(201).json(company);
  })
  .catch(err => {
    console.log("Error: ", err);
    res.status(500).json({ error: 'something went terribly wrong' });
  });
})


router.delete('/:id', (req, res) => {

  Company.remove({_id: req.params.id})
    .then(company => {
      console.log("Successfully deleted company.");
      res.status(204);
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(404).json({ error: 'something went terribly wrong' });
    })
})


// {
//   "name": "Awesome winery",
//   "streetAddress": "1 shore drive",
//   "city": "boston",
//   "state": "MA",
//   "hours": [ {"open": 10, "close": 18},
//     {"open": 10, "close": 18},
//     {"open": 10, "close": 18},
//     {"open": 10, "close": 18},
//     {"open": 10, "close": 18},
//     {"open": 10, "close": 18},
//     {"open": 10, "close": 18} ],
//   "imageUrl": "boy1.png",
//   "types": ["wine", "mead"]
// }
module.exports = {router};
