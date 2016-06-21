const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define the user model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save hook: Encrypt password
userSchema.pre('save', function(next) {
  const user = this;

  // generate a salt, then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // Encrypt (hash) password using salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // overwrite plaintext password with hased pw
      user.password = hash;
      next();
    })
  });
});

// Compare a password
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  // bcrypt will handle the salting + hashing before the comparison
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
