const SongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { songService, songValidator }) => {
    const songHandler = new SongHandler(songService, songValidator);
    server.route(routes(songHandler));
  },
};
