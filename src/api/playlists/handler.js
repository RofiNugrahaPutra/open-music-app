/* eslint no-underscore-dangle: 0 */

class PlaylistHandler {
  constructor(playlistService, playlistSongService, songService, playlistValidator) {
    this._playlistService = playlistService;
    this._playlistSongService = playlistSongService;
    this._songService = songService;
    this._playlistValidator = playlistValidator;
  }

  async postPlaylistHandler(req, res) {
    this._playlistValidator.validatePostPlaylistPayload(req.payload);
    const { name } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    const playlistId = await this._playlistService.addPlaylist({
      name, owner: credentialId,
    });

    return res.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(req) {
    const { id: credentialId } = req.auth.credentials;

    const playlists = await this._playlistService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getPlaylistActivityHandler(req) {
    const { playlistId: playlistActivityId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(
      playlistActivityId,
      credentialId,
    );

    const playlist = await this._playlistService.getPlaylistById(playlistActivityId);
    const activities = await this._playlistService.getPlaylistActivityById(playlistActivityId);

    return {
      status: 'success',
      data: {
        playlistId: playlist.id,
        activities,
      },
    };
  }

  async postSongToPlaylistHandler(req, res) {
    this._playlistValidator.validatePostSongToPlaylistPayload(req.payload);

    const { playlistId } = req.params;
    const { songId } = req.payload;
    const { id: credentialId } = req.auth.credentials;
    const action = 'add';

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songService.getSongById(songId);
    await this._playlistSongService.addSongToPlaylistId({
      playlistId,
      songId,
    });

    await this._playlistService.addPlaylistActivity(
      playlistId,
      songId,
      credentialId,
      action,
    );

    return res.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke Playlist',
    }).code(201);
  }

  async getSongsFromPlaylistIdHandler(req) {
    const { playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistService.getPlaylistById(playlistId);
    playlist.songs = await this._playlistSongService.getSongsFromPlaylistId(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistByIdHandler(req) {
    const { playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

    await this._playlistService.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async deleteSongFromPlaylistIdHandler(req) {
    this._playlistValidator.validatePostSongToPlaylistPayload(req.payload);

    const { playlistId } = req.params;
    const { songId } = req.payload;
    const { id: credentialId } = req.auth.credentials;
    const action = 'delete';

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongService.deleteSongFromPlaylistId(playlistId, songId);
    await this._playlistService.addPlaylistActivity(
      playlistId,
      songId,
      credentialId,
      action,
    );

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistHandler;
