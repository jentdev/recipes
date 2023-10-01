// module dependencies
const express = require('express');
const dotenv = require('dotenv'); // to load and use config
const morgan = require('morgan'); // log requests and response time
const path = require('path'); // to join link to public folder
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // store session to db
const methodOverride = require('method-override'); // for put and delete

const connectDB = require('./config/db');

// load config !important
dotenv.config({ path: './config/config.env'});

// passport config
require('./config/passport')(passport);
//pass passport in as arg to use in passport.js

// export port
const PORT = process.env.PORT || 5000;

// initialize app
const app = express();

// use morgan to log requests
app.use(morgan('dev'));

// invoke function to connect to db after initialize app
connectDB();

// sessions - make sure it's above passport middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save if nothing is modified
  saveUninitialized: false, // don't create a session until something is stored
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI})
}));
app.use(passport.authenticate('session'));

// initialize passport middleware
app.use(passport.initialize());
app.use(passport.session()); // require session & implement session middleware

// bodyparser to get data from form
app.use(express.urlencoded({ extended: false }));

// method override for PUT and DELETE
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// set global var - so i don't have to pass in user
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
})

// routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/recipes', require('./routes/recipes'));

// set view engine to render views
app.set('view engine', 'ejs');

// use express.static to access public folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`server is running in ${process.env.NODE_DEV} mode on port ${PORT}`);
});