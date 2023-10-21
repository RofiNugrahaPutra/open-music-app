const ExportHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, {
    exportService, playlistSongService, playlistService, exportValidator,
  }) => {
    const exportHandler = new ExportHandler(
      exportService,
      playlistSongService,
      playlistService,
      exportValidator,
    );
    server.route(routes(exportHandler));
  },
};
