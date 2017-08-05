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

  // (req.body._id
  //   ? User.findOneAndUpdate(
  //       { _id: req.session.userId, 'contacts._id': req.body._id },
  //       { 'contacts.$': contact },
  //       { upsert: true, runValidators: true }
  //     )
  //   : User.findOneAndUpdate({ _id: req.session.userId }, { $push: { contacts: contact } }, { runValidators: true }))
  //   .then(user => {
  //     console.log('update', user);
  //     res.send('sdffdsfsd');
  //   })
  //   .catch(err => {
  //     res.render('contactForm', {
  //       contact: contact,
  //       err: err
  //     });
  //   });

  // // get the user for the contact we are adding/editing
  // User.findByIdAndUpdate(
  //   req.session.userId,
  //   { $push: { contacts: req.body } },
  //   { safe: true, upsert: true, new: true }
  // ).then(user => {
  //   // get the contact geing edited or create a new contact
  //   // const contact = user.contacts.id(req.body._id) || new Contact();
  //   // contact.update(req.body);
  //   console.log('??????');
  //   res.send('fsddfsfdsfsd');
  // const contact = user.contacts.id(req.body._id) || new Contact(req.body);
  // console.log("edit?", user.contacts.id(req.body._id));
  // contact
  //   .validate()
  //   .then(() => {
  //     user.contacts.push(req.body);
  //     return user.save();
  //   })
  //   .then(() => res.send('saved!!!'))
  //   .catch(err => {
  //     res.render('contactForm', {
  //       contact: contact,
  //       err: err
  //     });
  //   });
});

module.exports = routes;
