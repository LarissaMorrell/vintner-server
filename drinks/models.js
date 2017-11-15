const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const DrinkSchema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String , required: true },
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
});

// VIRTUALS
// rating average all of the reviews.rating
//

DrinkSchema.methods.apiRepr = function() {
    return {
        rating:this.rating
    };
};


const Drink = mongoose.model('Drink', DrinkSchema);

module.exports = {Drink};


// "drinks": [
//
//           "name": "Porter",
//           "rating": 4,
//           "type": "spirit",
//           "reviews": [
