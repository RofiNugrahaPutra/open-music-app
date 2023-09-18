/* eslint no-underscore-dangle: 0 */

class UserHandler {
  constructor(userService, userValidator) {
    this._userService = userService;
    this._userValidator = userValidator;
  }

  async postUserHandler(req, res) {
    this._userValidator.validateUserPayload(req.payload);

    const userId = await this._userService.addUser(req.payload);
    return res.response({
      status: 'success',
      data: { userId },
    }).code(201);
  }

  // async getUserByIdHandler(req) {
  //   const { id } = req.params;
  //   const user = await this._userService.getUserById(id);

  //   return {
  //     status: 'success',
  //     data: { user },
  //   };
  // }
}

module.exports = UserHandler;
