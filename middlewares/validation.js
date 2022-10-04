const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().min(2),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(2),
    password: Joi.string().required().min(2),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(2),
    password: Joi.string().required().min(2),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validatePostMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(1),
    director: Joi.string().required().min(1),
    duration: Joi.number().required().min(1),
    year: Joi.string().required().min(1),
    description: Joi.string().required().min(1),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('The image field is filled in incorrectly');
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('The trailerlink field is filled in incorrectly');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('The thumbnail field is filled in incorrectly');
    }),
    nameRU: Joi.string().required().min(1),
    nameEN: Joi.string().required().min(1),
    movieId: Joi.number().required().min(1),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports = {
  validateUpdate,
  validateLogin,
  validateSignUp,
  validatePostMovie,
  validateDeleteMovie,
};
