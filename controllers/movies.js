const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// GET /movies
module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

// POST /movies
module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      nameRU,
      nameEN,
      movieId,
    } = req.body;
    const newMovie = new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      nameRU,
      nameEN,
      movieId,
      owner: req.user._id,
    });
    res.send(await newMovie.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Incorrect data was transmitted when creating the card'));
    } else {
      next(err);
    }
  }
};

// DELETE /movies/:movieId
module.exports.deleteMovieById = async (req, res, next) => {
  try {
    const deletedMovie = await Movie.findById(req.params.movieId);
    if (deletedMovie) {
      if (req.user._id === deletedMovie.owner._id.toString()) {
        await Movie.findByIdAndRemove(req.params.movieId);
        res.send({ message: 'The following card details have been deleted', deletedMovie });
      } else {
        throw new ForbiddenError('You cant delete someone elses card');
      }
    } else {
      throw new NotFoundError('Card not found');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid card id was transmitted'));
    } else {
      next(err);
    }
  }
};
