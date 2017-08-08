const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First Name is required'] },
  lastName: { type: String, required: [true, 'Last Name is required'] },
  company: { type: String },
  phone: { type: String },
  emailAddress: { type: String },
  note: { type: String }
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First Name is required'] },
  lastName: { type: String, required: [true, 'Last Name is required'] },
  emailAddress: {
    type: String,
    required: [true, 'Email Address is required'],
    unique: true
  },
  // todo: add match attribute for password to test for password complexity
  //password: { type: String, required: [true, 'Password is required'] },
  passwordHash: { type: String, required: true },
  contacts: [contactSchema]
});

// custom method for User instances
userSchema.methods.setPassword = function(password) {
  const hash = bcrypt.hashSync(password, 8);
  this.passwordHash = hash;
};

// add an instance method to the user to authenticate that a provided password matches the user's hash
userSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// add a static method to authenticate a user
userSchema.statics.authenticate = function(emailAddress, password, done) {
  return this.findOne({ emailAddress }).then(user => {
    return user && user.authenticate(password) ? user : null;
  });
};

// This is a plugin that validates uniqueness, which mongoose does not.
// The error message below is super generic. I'm not sure how to make it specific here.
userSchema.plugin(uniqueValidator, { message: 'This must be unique.' });

const User = mongoose.model('User', userSchema);
const Contact = mongoose.model('Contact', contactSchema);

module.exports.User = User;
module.exports.Contact = Contact;
