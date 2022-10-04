const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/bad-req-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const DUPLICATE_ERROR_CODE = 11000;

// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.send({ message: 'Registration was successful!', _id: user._id, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data was transmitted when creating a user'));
      } else if (err.code === DUPLICATE_ERROR_CODE) {
        next(new ConflictError('The user with this email already exists'));
      } else {
        next(err);
      }
    });
};

// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .send({ message: 'Authorization was successful!' });
    })
    .catch(() => {
      next(new UnauthorizedError('Authentication error'));
    });
};

// PATCH /users/me
module.exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, email: req.body.email },
      {
        new: true,
        runValidators: true,
      },
    );
    if (user) {
      res.send(user);
    } else {
      throw new NotFoundError('The user with the specified id was not found');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Incorrect data was transmitted when updating the profile'));
    } else {
      next(err);
    }
  }
};

// GET /users/me
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// POST /logout
module.exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    res.cookie('jwt', token, {
      maxAge: 1,
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
      .send({ message: 'The log out was successful!' });
  } catch (err) {
    next(err);
  }
};
