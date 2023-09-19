const ClientError = require('../../exceptions/ClientError');
/* eslint no-underscore-dangle: 0 */

class CollaborationHandler {
  constructor(
    collaborationService,
    playlistService,
    userService,
    collaborationValidator,
  ) {
    this._collaborationService = collaborationService;
    this._playlistService = playlistService;
    this._userService = userService;
    this._collaborationValidator = collaborationValidator;
  }

  async postCollaborationHandler(req, res) {
    this._collaborationValidator.validateCollaborationPayload(req.payload);
    const { id: credentialId } = req.auth.credentials;
    const { playlistId, userId } = req.payload;

    await this._userService.getUserById(userId);
    await this._playlistService.getPlaylistById(playlistId);

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationService.addCollaboration(
      playlistId,
      userId,
    );

    return res.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollaborationHandler(req) {
    this._collaborationValidator.validateCollaborationPayload(req.payload);
    const { id: credentialId } = req.auth.credentials;
    const { playlistId, userId } = req.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationHandler;
