const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ReviewSchema = mongoose.Schema({
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    comment: { type: String, default: ''},
    price: { type: Number, default: ''},
    purchased: { type: Boolean },
    flavors: { type: Array },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    drink: {type: mongoose.Schema.Types.ObjectId, ref: 'Drink', required: true}
});

ReviewSchema.methods.apiRepr = function() {
    return {
      id: this._id,
      rating: this.rating,
      title: this.title,
      comment: this.comment,
      price: this.price,
      purchased: this.purchased,
      flavors: this.flavors,
      user: this.user,
      drink: this.drink
    };
};

const Review = mongoose.model('Review', ReviewSchema);

module.exports = {Review};
