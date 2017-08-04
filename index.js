const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// require our routers
const publicRoutes = require('./routes/public');

// configure mongoose
mongoose.Promise = require('bluebird');

// create express app
const app = express();

// tell express to use handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('views', './views');
app.set('view engine', 'handlebars');

// configure session support middleware with express-session
app.use(session({ secret: 'keyboard kitten', resave: false, saveUninitialized: true }));

// tell express how to serve static files
app.use(express.static('public'));

//tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// configure our routers
app.use('/', publicRoutes);

// connect to mongo using mongoose and start the app
mongoose
  .connect('mongodb://localhost:27017/recipes')
  .then(() => app.listen(3000, () => console.log('ready to roll!!')));
