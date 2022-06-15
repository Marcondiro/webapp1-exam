'use strict';

const express = require('express');
const { params, body, oneOf, validationResult } = require('express-validator');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const dao = require('./dao');

//Routes
const coursesRouter = require('./routes/coursesRoute');
const studyPlansRouter = require('./routes/studyPlansRoute');

const PORT = 3001;
const PREFIX = '/api/v1';

const app = new express();

app.use(morgan('dev'));
app.use(express.json());

//CORS setup
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

//Passport authentication setup
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await dao.getUser(username, password)
  return user ? cb(null, user) : cb(null, false, 'Incorrect username or password.');
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  return req.isAuthenticated() ? next() : res.status(401).send({ error: 'Unauthorized' });
}

//Sessions setup
app.use(session({
  secret: "I'm a 🫖",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

//Routes
app.use(PREFIX + '/courses', coursesRouter);

app.use(PREFIX + '/studyPlans', isLoggedIn); // protect all studyPlans requests
app.use(PREFIX + '/studyPlans', studyPlansRouter);

const sessionsRouter = express.Router();

sessionsRouter.post('',
  body('username').isEmail(),
  body('password').isString(),
  function (req, res, next) {
    const err = validationResult(req);
    //error validating input parameters
    if (!err.isEmpty())
      return res.status(422).json(err);
    next();
  },
  passport.authenticate('local'),
  function (req, res) {
    return res.status(201).json(req.user);
  });

sessionsRouter.delete('/:studentId(\\d+)', isLoggedIn, (req, res) => {
  try {
    if (req.user.id !== Number(req.params.studentId))
      return res.status(403).json({ error: 'Forbidden' });

    req.logout(() => {
      res.status(205).end();
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(PREFIX + '/sessions', sessionsRouter);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
