const movieRoutes = require('express').Router();
const express = require('express');
const { validatePostMovie, validateDeleteMovie } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');

movieRoutes.get('/movies/', auth, getMovies);
movieRoutes.post('/movies/', auth, express.json(), validatePostMovie, createMovie);
movieRoutes.delete('/movies/:movieId', auth, validateDeleteMovie, deleteMovieById);

module.exports = movieRoutes;
