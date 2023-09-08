/* eslint no-underscore-dangle: 0 */
class OpenMusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(req, res) {
    this._validator.validateAlbumPayload(req.payload);
    const { name = 'untitled', year } = req.payload;
    const albumId = await this._service.addAlbum({ name, year });

    return res.response({
      status: 'success',
      data: { albumId },
    }).code(201);
  }

  async getAlbumByIdHandler(req) {
    const { id } = req.params;
    const album = await this._service.getAlbumById(id);
    album.songs = await this._service.getSongAlbumById(id);

    return {
      status: 'success',
      data: { album },
    };
  }

  async putAlbumByIdHandler(req) {
    this._validator.validateAlbumPayload(req.payload);
    const { id } = req.params.id;
    await this._service.editAlbumById(id, req.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbaharui',
    };
  }

  async deleteAlbumByIdHandler(req) {
    const { id } = req.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postSongHandler(req, res) {
    this._validator.validateSongPayload(req.payload);
    const {
      title, year, performer, genre, duration, albumId,
    } = req.payload;
    const songId = this._service.addSong({
      title, year, performer, genre, duration, albumId,
    });

    return res.response({
      status: 'success',
      data: { songId },
    }).code(201);
  }

  async getSongsHandler(req) {
    let songs = await this._service.getSongs(req.query);

    const { title, performer } = req.query;

    if (title) {
      songs = songs.filter((item) => item.title.toLowerCase().includes(title.toLowerCase()));
    }

    if (performer) {
      songs = songs.filter((item) => item.performer.toLowerCase().includes(performer.toLowerCase()));
    }

    return {
      status: 'success',
      data: { songs },
    };
  }

  async getSongByIdHandler(req) {
    const { id } = req.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: { song },
    };
  }

  async putSongByIdHandler(req) {
    this._validator.validateSongPayload(req.payload);
    const { id } = req.params;
    await this._service.editSongById(id, req.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbaharui',
    };
  }

  async deleteSongByIdHandler(req) {
    const { id } = req.params;
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

exports.module = OpenMusicHandler;
