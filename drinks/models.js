const mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

mongoose.Promise = global.Promise;

const DrinkSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String , required: true },
  company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
  reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
});

DrinkSchema.plugin(deepPopulate);

DrinkSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    company: this.company,
    reviews: this.reviews,
    //  rating:this.rating
  };
};
DrinkSchema.methods.apiReprWithRating = function() {
  let ratingSum = this.reviews.reduce((sum, review)=> review.rating + sum, 0)
  let drink =  {
    id: this._id,
    name: this.name,
    type: this.type,
    company: this.company,
    reviews: this.reviews,
    rating: (ratingSum / this.reviews.length) || 0
  }
  return drink;
};






const Drink = mongoose.model('Drink', DrinkSchema);

module.exports = {Drink};
