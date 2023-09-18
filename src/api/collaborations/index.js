const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server,
    {
      collaborationService, playlistService, userService, collaborationValidator,
    },
  ) => {
    const collaborationHandler = new CollaborationHandler(
      collaborationService,
      playlistService,
      userService,
      collaborationValidator,
    );
    server.route(routes(collaborationHandler));
  },
};
