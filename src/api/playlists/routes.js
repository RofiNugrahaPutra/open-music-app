const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (req, res) => handler.postPlaylistHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (req, res) => handler.getPlaylistsHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: (req, res) => handler.postSongToPlaylistHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: (req, res) => handler.getSongsFromPlaylistIdHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/activities',
    handler: (req, res) => handler.getPlaylistActivityHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: (req, res) => handler.deletePlaylistByIdHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: (req, res) => handler.deleteSongFromPlaylistIdHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
