const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/* eslint no-underscore-dangle: 0 */
class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const result = await this._pool.query({
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    });

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const result = await this._pool.query({
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const result = await this._pool.query({
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Album tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const result = await this._pool.query({
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Album tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
