const mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

mongoose.Promise = global.Promise;

const CompanySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },

    hours: { type: Array, default: ["","","","","","",""] },
    imageUrl: { type: String, default:"https://www.narda-sts.com/fileadmin/_processed_/csm_no-image-available_EN_3dd8d65e1e.png" },
    types: { type: Array, default:[] },
    drinks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Drink'}]
});

CompanySchema.plugin(deepPopulate);

CompanySchema.methods.apiRepr = function() {
  return {
    id: this._id,
    name: this.name,
    streetAddress: this.streetAddress,
    city: this.city,
    state: this.state,
    hours: this.hours,
    imageUrl: this.imageUrl,
    types: this.types,
    drinks: this.drinks
  };
}
CompanySchema.methods.apiReprWithRating = function() {
  let drinks = this.drinks.map((drink)=> drink.apiReprWithRating())
  let companyRatingSum = drinks.reduce((sum, drink)=> drink.rating + sum, 0) ;

  return {
    id: this._id,
    name: this.name,
    streetAddress: this.streetAddress,
    city: this.city,
    state: this.state,
    hours: this.hours,
    imageUrl: this.imageUrl,
    types: this.types,
    drinks: drinks,
    rating: (companyRatingSum / this.drinks.length) || 0
  };
}

const Company = mongoose.model('Company', CompanySchema);

module.exports = {Company};
