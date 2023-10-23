/* eslint no-underscore-dangle: 0 */
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

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

/* Uploads */
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadValidator = require('./validators/uploads');

/* Cache */
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const albumService = new AlbumService(cacheService);
  const songService = new SongService();
  const userService = new UserService();
  const authenticationService = new AuthenticationService();
  const collaborationService = new CollaborationService();
  const playlistService = new PlaylistService(collaborationService);
  const playlistSongService = new PlaylistSongService();
  const storageService = new StorageService(
    path.resolve(__dirname, 'api/uploads/file/images'),
  );

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
    {
      plugin: Inert,
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
      {
        plugin: uploads,
        options: {
          uploadService: storageService,
          albumService,
          uploadValidator: UploadValidator,
        },
      },
    ],
  );

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan di: ${server.info.uri}`);
};

init();
