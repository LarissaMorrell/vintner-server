const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    avatar: {
      type: String,
      required: true
    },
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
});

UserSchema.plugin(deepPopulate);

UserSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        avatar: this.avatar || ''
    };
};
UserSchema.methods.apiReprWithReviews = function() {
    return {
        id: this._id,
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        avatar: this.avatar || '',
        reviews: this.reviews
    };
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 8);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
