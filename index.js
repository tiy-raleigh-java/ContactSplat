const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// require our routers
const contactRoutes = require('./routes/contact');
const userRoutes = require('./routes/user');

// configure mongoose
mongoose.Promise = require('bluebird');

// create express app
const app = express();

// tell express to use handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('views', './views');
app.set('view engine', 'handlebars');

// tell express how to serve static files
app.use(express.static('public'));

app.use(
  session({
    secret: 'keyboard kitten',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

//tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// configure our routers
app.use('/', contactRoutes);
app.use('/user', userRoutes);

// connect to mongo using mongoose and start the app
mongoose
  .connect('mongodb://localhost:27017/contacts')
  // configure session support middleware with express-session
  .then(() => app.listen(3000, () => console.log('ready to roll!!')));
