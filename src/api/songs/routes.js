const routes = (handler) => [
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
