const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (req, res) => handler.postAuthenticationHandler(req, res),
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (req, res) => handler.putAuthenticationHandler(req, res),
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (req, res) => handler.deleteAuthenticationHandler(req, res),
  },
];

module.exports = routes;
