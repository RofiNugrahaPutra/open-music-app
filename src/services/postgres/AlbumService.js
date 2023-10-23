const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/* eslint no-underscore-dangle: 0 */
class AlbumService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
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

    try {
      await this._cacheService.delete('albums');
    } catch (error) {
      console.error('Error menghapus cache:', error);
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    try {
      const result = await this._cacheService.get(`albums:${id}`);

      return JSON.parse(result);
    } catch (error) {
      const result = await this._pool.query({
        text: 'SELECT id, name, year, cover AS "coverUrl" FROM albums WHERE id = $1',
        values: [id],
      });

      if (!result.rows.length) {
        throw new NotFoundError('Album tidak ditemukan');
      }

      await this._cacheService.set(`albums:${id}`, JSON.stringify(result.rows[0]));

      return result.rows[0];
    }
  }

  async editAlbumById(id, { name, year, coverUrl }) {
    const result = await this._pool.query({
      text: 'UPDATE albums SET name = $1, year = $2, cover = $3 WHERE id = $4 RETURNING id',
      values: [name, year, coverUrl, id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Album tidak ditemukan');
    }

    await this._cacheService.delete(`albums:${id}`);
  }

  async deleteAlbumById(id) {
    const result = await this._pool.query({
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Album tidak ditemukan');
    }

    await this._cacheService.delete(`albums:${id}`);
  }

  async addAlbumCover(cover, id) {
    await this._pool.query({
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [cover, id],
    });
  }

  async addLikeAlbumById(userId, albumId) {
    const id = `albumlike-${nanoid(16)}`;

    const result = await this._pool.query({
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    });

    if (!result.rows[0].id) {
      throw new InvariantError('Permintaan gagal. Id tidak ditemukan');
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async deleteLikedAlbumById(userId, albumId) {
    const result = await this._pool.query({
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Permintaan gagal. Id tidak ditemukan');
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async getLikedAlbumByUserId(userId, albumId) {
    const result = await this._pool.query({
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    });

    return result.rows[0].count;
  }

  async getAllLikedAlbumById(id) {
    try {
      const result = await this._cacheService.get(`album-likes:${id}`);

      return {
        isCache: true,
        totalLikes: Number(result),
      };
    } catch (error) {
      const result = await this._pool.query({
        text: 'SELECT COUNT(user_id) FROM user_album_likes WHERE album_id = $1',
        values: [id],
      });

      const totalLikes = result.rows[0].count;

      await this._cacheService.set(`album-likes:${id}`, totalLikes);

      return {
        totalLikes,
      };
    }
  }
}

module.exports = AlbumService;
