const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");

const { Company } = require("./models");
const router = express.Router();

router.get("/", (req, res) => {
  return Company.find()
    .populate("drinks")
    .deepPopulate("drinks.reviews")
    .then(companies =>
      res.json(companies.map(company => company.apiReprWithRating()))
    )
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

router.get("/:id", (req, res) => {
  return Company.findById(req.params.id)
    .populate("drinks")
    .deepPopulate("drinks.reviews")
    .then(company => res.json(company.apiReprWithRating())) //no render bc in component?
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/", (req, res) => {
  const requiredFields = ["name", "streetAddress", "city", "state"];
  for (let field of requiredFields) {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Company.create({
    name: req.body.name,
    streetAddress: req.body.streetAddress,
    city: req.body.city,
    state: req.body.state,
    hours: req.body.hours,
    imageUrl: req.body.imageUrl,
    types: req.body.types,
    drinks: req.body.drinks
  })
    .then(company => {
      console.log("Successfully created a company.");
      res.status(201).json(company);
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ error: "Failed to create company" });
    });
});

router.put("/:id", (req, res) => {
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${
      req.body.id
    }) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  const toUpdate = {};
  const updateableFields = [
    "name",
    "streetAddress",
    "city",
    "state",
    "hours",
    "imageUrl",
    "types",
    "drinks"
  ];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  Company.findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
    .exec()
    .then(company => res.status(200).json(company.apiRepr()))
    .catch(err =>
      res.status(500).json({ message: "Failure to update company" })
    );
});

router.delete("/:id", (req, res) => {
  Company.remove({ _id: req.params.id })
    .exec() //make a promise
    .then(company => {
      console.log("Successfully deleted company.");
      res.status(204).send();
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(404).json({ error: "Failed to delete company" });
    });
});

module.exports = { router };
