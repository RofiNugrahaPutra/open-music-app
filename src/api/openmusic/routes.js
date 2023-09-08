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
  {
    method: 'POST',
    path: '/songs',
    handler: (req, res) => handler.postSongHandler(req, res),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (req) => handler.getSongsHandler(req),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (req, res) => handler.getSongByIdHandler(req, res),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (req, res) => handler.putSongByIdHandler(req, res),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (req, res) => handler.deleteSongByIdHandler(req, res),
  },
];

exports.module = routes;
