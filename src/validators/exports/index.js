const ExportPlaylistPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportValidator = {
  validateExportPlaylistPayload: (payload) => {
    const { error } = ExportPlaylistPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

module.exports = ExportValidator;
