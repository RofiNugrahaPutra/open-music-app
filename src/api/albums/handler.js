/* eslint no-underscore-dangle: 0 */
class AlbumHandler {
  constructor(albumService, songService, albumValidator) {
    this._albumService = albumService;
    this._songService = songService;
    this._albumValidator = albumValidator;
  }

  async postAlbumHandler(req, res) {
    this._albumValidator.validateAlbumPayload(req.payload);
    const albumId = await this._albumService.addAlbum(req.payload);

    return res.response({
      status: 'success',
      data: { albumId },
    }).code(201);
  }

  async getAlbumByIdHandler(req) {
    const { id } = req.params;
    const album = await this._albumService.getAlbumById(id);
    album.songs = await this._songService.getSongAlbumById(id);

    return {
      status: 'success',
      data: { album },
    };
  }

  async putAlbumByIdHandler(req) {
    this._albumValidator.validateAlbumPayload(req.payload);
    const { id } = req.params;
    await this._albumService.editAlbumById(id, req.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbaharui',
    };
  }

  async deleteAlbumByIdHandler(req) {
    const { id } = req.params;
    await this._albumService.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumHandler;
