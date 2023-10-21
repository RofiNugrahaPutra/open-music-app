const UploadHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { uploadService, albumService, uploadValidator }) => {
    const uploadHandler = new UploadHandler(uploadService, albumService, uploadValidator);
    server.route(routes(uploadHandler));
  },
};
