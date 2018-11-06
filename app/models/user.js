const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  name: String,
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

// hash the password before the user is saved
userSchema.pre('save', function(next) {
  const user = this;

// hash the password only if the password has been changed or user is new
  if (!user.isModified('password'))
    return next();

// generate the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(userPassword, cb) {
  bcrypt.compare(userPassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema)
;
