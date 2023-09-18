const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/* eslint no-underscore-dangle: 0 */
class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylistId({ playlistId, songId }) {
    const id = `playlistsong-${nanoid(16)}`;

    const result = await this._pool.query({
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    });

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke Playlist');
    }

    return result.rows[0].id;
  }

  async getSongsFromPlaylistId(playlistId) {
    const result = await this._pool.query({
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists
      INNER JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      INNER JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlists.id = $1`,
      values: [playlistId],
    });

    if (!result.rows.length) {
      throw new InvariantError('Gagal mengambil lagu-lagu dari playlist');
    }

    return result.rows;
  }

  async deleteSongFromPlaylistId(playlistId, songId) {
    const result = await this._pool.query({
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    });

    if (!result.rows.length) {
      throw new NotFoundError(
        'Lagu gagal dihapus dari playlist. Id tidak ditemukan',
      );
    }
  }
}

module.exports = PlaylistSongService;
