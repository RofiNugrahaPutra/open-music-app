const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (req, res) => handler.postUserHandler(req, res),
  },
  // {
  //   method: 'GET',
  //   path: '/users/{id}',
  //   handler: (req, res) => handler.getUserByIdHandler(req, res),
  // },
];

module.exports = routes;
