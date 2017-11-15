const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ReviewSchema = mongoose.Schema({
    rating: { type: Number, required: true },
    title: { type: String },
    comments: { type: String, default: ''},
    price: { type: Number, default: ''},
    purchased: { type: Boolean },
    flavors: { type: Array },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    drink: {type: mongoose.Schema.Types.ObjectId, ref: 'Drink'}
});

// UserSchema.methods.apiRepr = function() {
//     return {
//         userID: this.username || '',
//         firstName: this.firstName || '',
//         lastName: this.lastName || ''
//     };
// };

const Review = mongoose.model('Review', ReviewSchema);

module.exports = {Review};
