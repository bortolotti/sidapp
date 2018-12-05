const mongoose = require('mongoose');
const service = require('feathers-mongoose');

const Schema = mongoose.Schema;
const QuerySchema = new Schema({
  code: {
    type: String,
    unique: true,
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
  dataRepository: {
    createTableScript: {
      type: String,
      require: false
    },
    insertScript: {
      type: String,
      require: false
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
}, { id: true });

QuerySchema.set('id', true)

const Model = mongoose.model('Query', QuerySchema);

module.exports = service({ Model })