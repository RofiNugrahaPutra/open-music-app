/* eslint no-underscore-dangle: 0 */
class SongHandler {
  constructor(songService, songValidator) {
    this._songService = songService;
    this._songValidator = songValidator;
  }

  async postSongHandler(req, res) {
    this._songValidator.validateSongPayload(req.payload);
    const songId = await this._songService.addSong(req.payload);

    return res.response({
      status: 'success',
      data: { songId },
    }).code(201);
  }

  async getSongsHandler(req) {
    let songs = await this._songService.getSongs(req.query);

    const { title, performer } = req.query;

    if (title) {
      songs = songs.filter((item) => item.title
        .toLowerCase().includes(title.toLowerCase()));
    }

    if (performer) {
      songs = songs.filter((item) => item.performer
        .toLowerCase().includes(performer.toLowerCase()));
    }

    return {
      status: 'success',
      data: { songs },
    };
  }

  async getSongByIdHandler(req) {
    const { id } = req.params;
    const song = await this._songService.getSongById(id);

    return {
      status: 'success',
      data: { song },
    };
  }

  async putSongByIdHandler(req) {
    this._songValidator.validateSongPayload(req.payload);
    const { id } = req.params;
    await this._songService.editSongById(id, req.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbaharui',
    };
  }

  async deleteSongByIdHandler(req) {
    const { id } = req.params;
    await this._songService.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongHandler;
