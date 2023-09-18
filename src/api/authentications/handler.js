/* eslint no-underscore-dangle: 0 */

class AuthenticationHandler {
  constructor(authenticationService, userService, tokenManager, authenticationValidator) {
    this._authenticationService = authenticationService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._authenticationValidator = authenticationValidator;
  }

  async postAuthenticationHandler(req, res) {
    this._authenticationValidator.validatePostAuthenticationPayload(req.payload);

    const { username, password } = req.payload;

    const id = await this._userService.verifyUserCredential(
      username,
      password,
    );

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationService.addRefreshToken(refreshToken);

    return res.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: { accessToken, refreshToken },
    }).code(201);
  }

  async putAuthenticationHandler(req) {
    this._authenticationValidator.validatePutAuthenticationPayload(req.payload);

    const { refreshToken } = req.payload;
    await this._authenticationService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: { accessToken },
    };
  }

  async deleteAuthenticationHandler(req) {
    this._authenticationValidator.validateDeleteAuthenticationPayload(req.payload);

    const { refreshToken } = req.payload;

    await this._authenticationService.verifyRefreshToken(refreshToken);
    await this._authenticationService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationHandler;
