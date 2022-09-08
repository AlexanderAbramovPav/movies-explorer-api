const Router = require('express').Router();
const express = require('express');
const {
  validatePostMovie,
  validateDeleteMovie,
  validateUpdate,
  validateLogin,
  validateSignUp,
} = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');
const {
  updateUser, getUser, login, createUser, logout,
} = require('../controllers/users');

Router.post('/signup', express.json(), validateSignUp, createUser);
Router.post('/signin', express.json(), validateLogin, login);
Router.use(auth);

Router.get('/users/me', getUser);
Router.patch('/users/me', express.json(), validateUpdate, updateUser);
Router.post('/logout', logout);

Router.get('/movies/', getMovies);
Router.post('/movies/', express.json(), validatePostMovie, createMovie);
Router.delete('/movies/:movieId', validateDeleteMovie, deleteMovieById);

module.exports = Router;
