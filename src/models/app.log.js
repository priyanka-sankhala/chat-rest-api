const mongoes = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
//mongoes.set('debug',process.env.MONGODB_DEBUG_MODE );//
const opts = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
const logSchema = mongoes.Schema(
  {
    headers: {
      type: Object,
    },
    params: {
      type: Object,
    },
    url: {
      type: Object,
    },
    start_time: {
      type: Number,
    },
    ip: {
      type: String,
    },
    end_time: {
      type: Number,
    },
    rtime: {
      type: Number,
    },
    status_code: {
      type: Number,
    },
    response: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
  opts
);

logSchema.plugin(toJSON);
logSchema.plugin(paginate);

module.exports = mongoes.model('app.log', logSchema,'logs');
