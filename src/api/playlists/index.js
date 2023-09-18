const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistService, playlistSongService, songService, playlistValidator,
    },
  ) => {
    const playlistHandler = new PlaylistHandler(
      playlistService,
      playlistSongService,
      songService,
      playlistValidator,
    );
    server.route(routes(playlistHandler));
  },
};
