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
      const { playlistId } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

      const playlistById = await this._playlistService.getPlaylistById(playlistId);
      const songs = await this._playlistSongService.getSongsFromPlaylistId(playlistId);

      const message = {
        playlistTarget: {
          playlist: {
            id: playlistById.id,
            name: playlistById.name,
            songs,
          },
        },
        targetEmail: req.payload.targetEmail,
      };

      await this._exportService.sendMessage('export:playlist', JSON.stringify(message));

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
