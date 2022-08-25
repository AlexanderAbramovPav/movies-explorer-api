require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const corsConfig = require('./middlewares/cors');
const limiter = require('./middlewares/rate-limiter');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const Router = require('./routes/index');

// Initialise port
const { PORT = 3000 } = process.env;

// Initialise app
const app = express();

// Add helmet
app.use(helmet());

// request Logger
app.use(requestLogger);

// Apply the rate limiting middleware to all requests
app.use(limiter);

// CORS config
app.use(corsConfig);

// Initailise Parsers
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { DB_URL = 'mongodb://localhost:27017/movies' } = process.env;

// MongoDB connect
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
})
  .then(() => console.log('Connected to Database'))
  .catch((err) => console.log(err.reason));

// Main routes
app.use(Router);

// 404 route
app.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Запрос сделан к несуществующей странице'));
});

// Error Logger
app.use(errorLogger);
app.use(errors());

// Common 500
app.use(errorHandler);

// Listen port
app.listen(PORT);
