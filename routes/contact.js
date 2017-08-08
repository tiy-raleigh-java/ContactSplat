const express = require('express');
const routes = express.Router();
const ObjectID = require('mongodb').ObjectID;

// my models
const User = require('../models/model').User;
const Contact = require('../models/model').Contact;

const requireLogin = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login/');
  }
};

/**
 * The main webroot homepage
 * @type {String}
 */
routes.get('/', requireLogin, (req, res) => {
  // render the route!
  res.render('contacts', {
    user: req.user,
    search: req.query.search,
    contacts: req.user.contacts.filter(
      contact =>
        new RegExp(req.query.search, 'i').test(contact.firstName) ||
        new RegExp(req.query.search, 'i').test(contact.lastName) ||
        new RegExp(req.query.search, 'i').test(contact.company) ||
        new RegExp(req.query.search, 'i').test(contact.note)
    )
  });
});

/**
 * Shows the form to create and edit contacts
 * @type {[type]}
 */
routes.get('/contactForm', requireLogin, (req, res) => {
  res.render('contactForm', {
    contact: req.user.contacts.id(req.query.id),
    user: req.user
  });
});

routes.get('/deleteContact', requireLogin, (req, res) => {
  req.user.contacts
    .id(req.query.id)
    .remove()
    .then(() => {
      return req.user.save();
    })
    .then(() => res.redirect('/'));
});

/**
 * creates or updates a contact
 * @type {Contact}
 */
routes.post('/saveContact', requireLogin, (req, res) => {
  const contact = new Contact(req.body);

  contact
    .validate()
    // contact is valid
    .then(() => {
      if (req.body._id) {
        // updating contact
        Object.assign(req.user.contacts.id(req.body._id), req.body);
      } else {
        // creating contact
        req.user.contacts.push(contact);
      }
      return req.user.save();
    })
    .then(() => {
      res.redirect('/');
    })
    // contact is invalid
    .catch(err => {
      res.render('contactForm', {
        contact: req.body,
        err: err,
        user: req.user
      });
    });
});

module.exports = routes;
