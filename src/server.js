/* eslint no-underscore-dangle: 0 */

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('./exceptions/ClientError');

/* Albums */
const AlbumService = require('./services/postgres/AlbumService');
const albums = require('./api/albums');
const AlbumValidator = require('./validators/albums');

/* Songs */
const SongService = require('./services/postgres/SongService');
const songs = require('./api/songs');
const SongValidator = require('./validators/songs');

/* Users */
const UserService = require('./services/postgres/UserService');
const users = require('./api/users');
const UserValidator = require('./validators/users');

/* Authentications */
const authentications = require('./api/authentications');
const AuthenticationService = require('./services/postgres/AuthenticationService');
const AuthenticationValidator = require('./validators/authentications');
const TokenManager = require('./tokenize/TokenManager');

/* Playlists */
const playlists = require('./api/playlists');
const PlaylistService = require('./services/postgres/PlaylistService');
const PlaylistSongService = require('./services/postgres/PlaylistSongService');
const PlaylistValidator = require('./validators/playlists');

/* Collaborations */
const collaborations = require('./api/collaborations');
const CollaborationService = require('./services/postgres/CollaborationService');
const CollaborationValidator = require('./validators/collaborations');

/* Exports */
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportValidator = require('./validators/exports');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authenticationService = new AuthenticationService();
  const collaborationService = new CollaborationService();
  const playlistService = new PlaylistService(collaborationService);
  const playlistSongService = new PlaylistSongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register(
    [
      {
        plugin: albums,
        options: {
          albumService,
          songService,
          albumValidator: AlbumValidator,
        },
      },
      {
        plugin: songs,
        options: {
          songService,
          songValidator: SongValidator,
        },
      },
      {
        plugin: users,
        options: {
          userService,
          userValidator: UserValidator,
        },
      },
      {
        plugin: authentications,
        options: {
          authenticationService,
          userService,
          tokenManager: TokenManager,
          authenticationValidator: AuthenticationValidator,
        },
      },
      {
        plugin: playlists,
        options: {
          playlistService,
          playlistSongService,
          songService,
          playlistValidator: PlaylistValidator,
        },
      },
      {
        plugin: collaborations,
        options: {
          collaborationService,
          playlistService,
          userService,
          collaborationValidator: CollaborationValidator,
        },
      },
      {
        plugin: _exports,
        options: {
          exportService: ProducerService,
          playlistSongService,
          playlistService,
          exportValidator: ExportValidator,
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
