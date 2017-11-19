const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ReviewSchema = mongoose.Schema({
    rating: { type: Number, required: true },
    title: { type: String },
    comment: { type: String, default: ''},
    price: { type: Number, default: ''},
    purchased: { type: Boolean },
    flavors: { type: Array },
    //TODO user and drink need to be required
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    drink: {type: mongoose.Schema.Types.ObjectId, ref: 'Drink'}
});

ReviewSchema.methods.apiRepr = function() {
    return {
      id: this._id,
      rating: this.rating,
      title: this.title,
      comment: this.comment,
      price: this.price,
      purchased: this.purchased,
      flavors: this.flavors
      //TODO add user and drink
    };
};

const Review = mongoose.model('Review', ReviewSchema);

module.exports = {Review};
