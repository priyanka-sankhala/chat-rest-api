const Joi = require('joi');

const createTodo = {
  body: Joi.object().keys({
    task: Joi.string().required(),
    assign_by: Joi.string().required(),
    assign_to: Joi.string().required(),
  }).unknown(true),
};

const list = {
  body: Joi.object().keys({
    limit: Joi.number().required(),
    page: Joi.number().required(),
  }),
};

const edit = {
  body: Joi.object().keys({
    assign_to: Joi.string(),
    is_reopen: Joi.boolean(),
    estimate_date: Joi.string(),
  }).min(1),
};

module.exports = {
  createTodo,
  list,
  edit
};
