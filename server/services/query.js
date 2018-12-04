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
  sqlConnection: {
    connectionString: {
      type: String,
      require: true
    },
    user: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    }
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

module.exports = service({ Model })