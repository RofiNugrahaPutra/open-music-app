const AuthenticationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authenticationService, userService, tokenManager, authenticationValidator,
  }) => {
    const authenticationHandler = new AuthenticationHandler(
      authenticationService,
      userService,
      tokenManager,
      authenticationValidator,
    );

    server.route(routes(authenticationHandler));
  },
};
