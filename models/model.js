const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

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
  password: { type: String, required: [true, 'Password is required'] },
  contacts: [contactSchema]
});
// This is a plugin that validates uniqueness, which mongoose does not.
// The error message below is super generic. I'm not sure how to make it specific here.
userSchema.plugin(uniqueValidator, { message: 'This must be unique.' });

const User = mongoose.model('User', userSchema);
const Contact = mongoose.model('Contact', contactSchema);

module.exports.User = User;
module.exports.Contact = Contact;
