require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
// const cors = require('cors');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Initialise port
const { PORT = 3000 } = process.env;

// Initialise app
const app = express();

// CORS config
// app.use(cors({
//   origin: [
//     'https://alexander.abramov.nomoredomains.sbs',
//     'http://alexander.abramov.nomoredomains.sbs',
//   ],
//   credentials: true,
//   methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Authorization', 'Content-type'],
// }));

// Initailise Parsers
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connect
mongoose.connect('mongodb://localhost:27017/movies', {
  useNewUrlParser: true,
}, (err) => {
  if (err) throw err;
});

// request Logger
app.use(requestLogger);

// SignIn route
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// SignUp route
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

// auth middleware
app.use(auth);

// Logout
app.post('/logout', (req, res) => {
  const token = req.cookies.jwt;
  res.cookie('jwt', token, {
    maxAge: 1,
    httpOnly: true,
  })
    .send({ message: 'Выход прошёл успешно!' });
});

// Main routes
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

// 404 route
app.use('/*', (req, res, next) => {
  next(new NotFoundError('Запрос сделан к несуществующей странице'));
});

// Error Logger
app.use(errorLogger);
app.use(errors());

// Common 500
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

// Listen port
app.listen(PORT);
