const UserHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { userService, userValidator }) => {
    const userHandler = new UserHandler(userService, userValidator);
    server.route(routes(userHandler));
  },
};
