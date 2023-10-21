const routers = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: (req, res) => handler.postExportPlaylistsHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routers;
