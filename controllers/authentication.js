const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User's email and pw have been auth'd; we need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  // Pull data from request body
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: "You must provide an email and a password." })
  }

  // See if user with email provided exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    if (existingUser) {
      // User does exist, return error
      return res.status(422).send({ error: 'Email already exists' });
    }
  });

  // If user does NOT exist, create him/her!
  const user = new User({
    email: email,
    password: password
  });

  user.save(function(err) {
    if (err) { return next(err) }

    // Successfully created user!
    res.json({ token: tokenForUser(user)});
  });
}
