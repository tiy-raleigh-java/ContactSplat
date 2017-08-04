const express = require('express');
const routes = express.Router();

/**
 * The main webroot homepage
 * @type {String}
 */
routes.get('/', (req, res) => {
  if (!req.session.user) res.redirect('/login');
  res.send('dfsfdsdfs');
});

/**
 * The login form
 * @type {String}
 */
routes.get('/login', (req, res) => {
  res.render('loginForm', {
    title: 'Login'
  });
});

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

  res.send('blargh');
});

module.exports = routes;
