'use strict'

const mongoose = require('mongoose');

// Make Mongoose use the ES6 promise
mongoose.Promise = global.Promise;

// Connect to a local database called `feathers`
mongoose.connect('mongodb://localhost:27017/sidapp');

module.exports = function () {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  const app = this

  app.use('/api/query', require('./query'))
  app.use('/api/pendingQuery', require('./pendingQuery'))

}