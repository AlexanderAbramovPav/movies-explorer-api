const mongoose = require('mongoose');
const validator = require('validator');

const MovieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Введена некорректная ссылка'],
  },
  trailerLink: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Введена некорректная ссылка'],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Введена некорректная ссылка'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: false,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', MovieSchema);
