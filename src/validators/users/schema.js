const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().max(48).required(),
  password: Joi.string().max(255).required(),
  fullname: Joi.string().max(255).required(),
});

module.exports = { UserPayloadSchema };
