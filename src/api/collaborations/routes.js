const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (req, res) => handler.postCollaborationHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (req, res) => handler.deleteCollaborationHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
