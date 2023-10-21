const { ImageHeadersSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UploadValidator = {
  validateImageHeaders: (headers) => {
    const { error } = ImageHeadersSchema.validate(headers);
    if (error) throw new InvariantError(error.message);
  },
};

module.exports = UploadValidator;
