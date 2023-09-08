require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

/* Albums */
const AlbumService = require('./services/postgres/AlbumService');
const albums = require('./api/albums');
const AlbumValidator = require('./validators/albums');

/* Songs */
const SongService = require('./services/postgres/SongService');
const songs = require('./api/songs');
const SongValidator = require('./validators/songs');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(
    [
      {
        plugin: albums,
        options: {
          service: albumService,
          validator: AlbumValidator,
        },
      },
      {
        plugin: songs,
        options: {
          service: songService,
          validator: SongValidator,
        },
      },
    ],
  );

  server.ext('onPreResponse', (req, res) => {
    // mendapatkan konteks response dari request
    const { response } = req;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        return res.response({
          status: 'fail',
          message: response.message,
        }).code(response.statusCode);
      }
      // mempertahankan penanganan client error oleh Hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return res.continue;
      }
      // penanganan server error sesuai kebutuhan
      return res.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      }).code(500);
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return res.continue;
  });

  await server.start();
  console.log(`Server berjalan di: ${server.info.uri}`);
};

init();
