const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().max(32).required(),
  userId: Joi.string().max(32).required(),
});

module.exports = { CollaborationPayloadSchema };
