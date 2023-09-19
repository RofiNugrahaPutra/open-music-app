const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (req, res) => handler.postUserHandler(req, res),
  },
];

module.exports = routes;
