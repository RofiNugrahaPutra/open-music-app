/* eslint no-underscore-dangle: 0 */
const ClientError = require('../../exceptions/ClientError');

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

  async postLikeAlbumByIdHandler(req, res) {
    const { id: albumId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._albumService.getAlbumById(albumId);

    const likedAlbumByUser = await this._albumService
      .getLikedAlbumByUserId(credentialId, albumId);

    if (Number(likedAlbumByUser) > 0) {
      throw new ClientError('Album sudah masuk dalam daftar suka');
    }

    await this._albumService.addLikeAlbumById(credentialId, albumId);

    return res.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    }).code(201);
  }

  async getAllLikedAlbumByIdHandler(req, res) {
    const { id } = req.params;
    const { totalLikes, isCache } = await this._albumService.getAllLikedAlbumById(id);

    const response = res.response({
      status: 'success',
      data: { likes: Number(totalLikes) },
    });

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deleteLikedAlbumByIdHandler(req) {
    const { id: albumId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._albumService.deleteLikedAlbumById(credentialId, albumId);

    return {
      status: 'success',
      message: 'Album berhasil dihapus dari daftar suka',
    };
  }
}

module.exports = AlbumHandler;
