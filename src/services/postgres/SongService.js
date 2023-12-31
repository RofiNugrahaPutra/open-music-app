const { Pool } = require('pg');
const { nanoid } = require('nanoid');
// const { mapAlbumModel, mapSongModel } = require('../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/* eslint no-underscore-dangle: 0 */
class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const result = await this._pool.query({
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    });

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');
    return result.rows;
  }

  async getSongById(id) {
    const result = await this._pool.query({
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  async getSongAlbumById(id) {
    const result = await this._pool.query({
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    });

    return result.rows;
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    await this.getSongById(id);

    const result = await this._pool.query({
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbaharui lagu. Lagu tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const result = await this._pool.query({
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Lagu tidak ditemukan');
    }
  }
}

module.exports = SongService;
