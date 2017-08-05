const express = require('express');
const routes = express.Router();
const ObjectID = require('mongodb').ObjectID;

// my models
const User = require('../models/model').User;
const Contact = require('../models/model').Contact;

/**
 * The main webroot homepage
 * @type {String}
 */
routes.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/user/login');
  // load the user based on their id
  User.findOne({ _id: req.session.userId }).then(user =>
    // render the route!
    res.render('contacts', {
      user: user,
      search: req.query.search,
      contacts: user.contacts.filter(
        contact =>
          new RegExp(req.query.search, 'i').test(contact.firstName) ||
          new RegExp(req.query.search, 'i').test(contact.lastName) ||
          new RegExp(req.query.search, 'i').test(contact.company) ||
          new RegExp(req.query.search, 'i').test(contact.note)
      )
    })
  );
});

/**
 * Shows the form to create and edit contacts
 * @type {[type]}
 */
routes.get('/contactForm', (req, res) => {
  if (!req.session.userId) return res.redirect('/user/login');

  // find the current user
  User.findOne({ _id: req.session.userId })
    // find the contact being edited, if any
    .then(user =>
      res.render('contactForm', {
        contact: user.contacts.id(req.query.id),
        user: user
      })
    );
});

routes.get('/deleteContact', (req, res) => {
  if (!req.session.userId) return res.redirect('/user/login');

  // find the current user
  User.findOne({ _id: req.session.userId })
    // find the contact being edited, if any
    .then(user => {
      user.contacts
        .id(req.query.id)
        .remove()
        .then(() => {
          return user.save();
        })
        .then(() => res.redirect('/'));
    });
});

/**
 * creates or updates a contact
 * @type {Contact}
 */
routes.post('/saveContact', (req, res) => {
  if (!req.session.userId) return res.redirect('/user/login');

  const contact = new Contact(req.body);

  User.findOne({ _id: req.session.userId }).then(user =>
    contact
      .validate()
      // contact is valid
      .then(() => {
        console.log(req.body._id);
        if (req.body._id) {
          // updating contact
          return User.findOneAndUpdate(
            { _id: req.session.userId, 'contacts._id': req.body._id },
            { 'contacts.$': contact },
            { upsert: true, runValidators: true }
          );
        } else {
          // creating contact
          return User.findOneAndUpdate(
            { _id: req.session.userId },
            { $push: { contacts: contact } },
            { runValidators: true }
          );
        }
      })
      .then(() => {
        res.redirect('/');
      })
      // contact is invalid
      .catch(err => {
        console.log(err);
        res.render('contactForm', {
          contact: req.body,
          err: err,
          user: user
        });
      })
  );
});

module.exports = routes;
