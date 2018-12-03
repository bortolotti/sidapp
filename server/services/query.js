const mongoose = require('mongoose');
const service = require('feathers-mongoose');

const Schema = mongoose.Schema;
const QuerySchema = new Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sqlQuery: {
    type: String,
    required: true
  },
  expireMinutes: {
    type: Number,
    required: true
  },
  lastUpdate: {
      type: Date,
      required: false
  }
});

const Model = mongoose.model('Query', QuerySchema);

var queryService = service({ Model })

module.exports = queryService