const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { albumService, songService, albumValidator }) => {
    const albumHandler = new AlbumHandler(albumService, songService, albumValidator);
    server.route(routes(albumHandler));
  },
};
