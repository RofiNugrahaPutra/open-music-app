const ClientError = require('../../exceptions/ClientError');

/* eslint no-underscore-dangle: 0 */

class ExportHandler {
  constructor(exportService, playlistSongService, playlistService, exportValidator) {
    this._exportService = exportService;
    this._playlistSongService = playlistSongService;
    this._playlistService = playlistService;
    this._exportValidator = exportValidator;
  }

  async postExportPlaylistsHandler(req, res) {
    try {
      this._exportValidator.validateExportPlaylistPayload(req.payload);
      const { id: owner } = req.auth.credentials;
      const { playlistId } = req.params;

      await this._playlistService.verifyPlaylistOwner(playlistId, owner);
      const playlist = await this._playlistSongService
        .getSongsFromPlaylistId(
          playlistId,
        );

      const message = {
        userId: owner,
        playlistId,
        targetEmail: req.payload.targetEmail,
        playlist,
      };

      await this._exportService.sendMessage('export:playlists', JSON.stringify(message));

      return res.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        const response = res.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = res.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportHandler;
