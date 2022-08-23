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

Router.get('/users/me', auth, getUser);
Router.patch('/users/me', auth, express.json(), validateUpdate, updateUser);
Router.post('/signin', express.json(), validateLogin, login);
Router.post('/signup', express.json(), validateSignUp, createUser);
Router.post('/logout', auth, logout);

Router.get('/movies/', auth, getMovies);
Router.post('/movies/', auth, express.json(), validatePostMovie, createMovie);
Router.delete('/movies/:movieId', auth, validateDeleteMovie, deleteMovieById);

module.exports = Router;
