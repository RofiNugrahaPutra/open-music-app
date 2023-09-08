const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (req, res) => handler.postAlbumHandler(req, res),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (req, res) => handler.getAlbumByIdHandler(req, res),
  },
  {
    method: 'GET',
    path: '/albums/{albumId}',
    handler: (req, res) => handler.getSongAlbumHandler(req, res),
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
];

exports.module = routes;