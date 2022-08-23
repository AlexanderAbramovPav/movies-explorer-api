const userRoutes = require('express').Router();
const express = require('express');
const {
  validateUpdate,
  validateLogin,
  validateSignUp,
} = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const {
  updateUser, getUser, login, createUser, logout,
} = require('../controllers/users');

userRoutes.get('/users/me', auth, getUser);
userRoutes.patch('/users/me', auth, express.json(), validateUpdate, updateUser);
userRoutes.post('/signin', express.json(), validateLogin, login);
userRoutes.post('/signup', express.json(), validateSignUp, createUser);
userRoutes.post('/logout', auth, logout);

module.exports = userRoutes;
