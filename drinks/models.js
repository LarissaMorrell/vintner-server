const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const DrinkSchema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String , required: true },
    company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
});

// VIRTUALS
// rating average all of the reviews.rating
//

DrinkSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        name: this.name,
        type: this.type,
        company: this.company,
        reviews: this.reviews
        // rating:this.rating
    };
};


const Drink = mongoose.model('Drink', DrinkSchema);

module.exports = {Drink};
