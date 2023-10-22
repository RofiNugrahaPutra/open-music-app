const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (req, res) => handler.postAlbumHandler(req, res),
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (req, res) => handler.postLikeAlbumByIdHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (req, res) => handler.getAlbumByIdHandler(req, res),
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (req, res) => handler.getAllLikedAlbumByIdHandler(req, res),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (req, res) => handler.putAlbumByIdHandler(req, res),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (req, res) => handler.deleteAlbumByIdHandler(req, res),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (req, res) => handler.deleteLikedAlbumByIdHandler(req, res),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
