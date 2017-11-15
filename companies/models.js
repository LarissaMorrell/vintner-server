const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CompanySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },

    hours: { type: Array }, // [ {open: 10, close: 18},{} ]
    imageUrl: { type: String },
    types: { type: Array },
    drinks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Drink'}]
});

CompanySchema.methods.apiRepr = function() {
  return {
    
  };
}

// VIRTUALS
// rating avg drinks rating >> drinks=avg of reviews rating
// totalReviewCount


const Company = mongoose.model('Company', CompanySchema);

module.exports = {Company};
