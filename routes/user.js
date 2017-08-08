const express = require('express');
const routes = express.Router();
const passport = require('../util/auth');

// my models
const User = require('../models/model').User;

/**
 * The login form
 * @type {String}
 */
routes.get('/login', (req, res) => {
  res.render('loginForm', {
    title: 'Login',
    messages: res.locals.getMessages()
  });
});

/**
 * Validate the user.
 * @type {String}
 */
routes.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login/',
    failureFlash: true
  })
);
// routes.post('/login', (req, res) => {
//   User.authenticate(req.body.emailAddress, req.body.password)
//     .then(user => {
//       req.session.userId = user._id.valueOf();
//       res.redirect('/');
//     })
//     .catch(err => {
//       res.render('loginForm', {
//         title: 'Login',
//         loginFailed: true,
//         emailAddress: req.body.emailAddress
//       });
//     });
// });

/**
 * The registration form
 * @type {String}
 */
routes.get('/register', (req, res) => {
  res.render('registrationForm', {
    title: 'Register'
  });
});

/**
 * Registration endpoint. Creates a new user.
 * @type {[type]}
 */
routes.post('/register', (req, res) => {
  // validate the posted data
  let user = new User(req.body);
  // hash the password
  user.setPassword(req.body.password);

  user
    .save()
    .then(() => {
      // put the user's record into the session
      req.session.userId = user._id.valueOf();
      // redirect to the homepage
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      res.render('registrationForm', {
        title: 'Register',
        user: user,
        err: err
      });
    });
});

/**
 * Logs the user out by destroying their session.
 * @type {[type]}
 */
routes.get('/logout', (req, res) => {
  req.session.destroy();
  //res.local.user = undefined;
  res.redirect('/user/login');
});

module.exports = routes;
