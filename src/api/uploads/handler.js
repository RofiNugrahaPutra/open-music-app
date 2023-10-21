const ClientError = require('../../exceptions/ClientError');
/* eslint no-underscore-dangle: 0 */
class UploadHandler {
  constructor(uploadService, albumService, uploadValidator) {
    this._uploadService = uploadService;
    this._albumService = albumService;
    this._uploadValidator = uploadValidator;
  }

  async postUploadAlbumCoverHandler(req, res) {
    try {
      const { cover } = req.payload;
      const { id } = req.params;

      this._uploadValidator.validateImageHeaders(cover.hapi.headers);

      const filename = await this._uploadService.writeFile(cover, cover.hapi);
      const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

      const { name, year } = await this._albumService.getAlbumById(id);
      await this._albumService.editAlbumById(id, { name, year, coverUrl });

      return res.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
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

module.exports = UploadHandler;
