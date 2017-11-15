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

//get.findById(_id)
//post
