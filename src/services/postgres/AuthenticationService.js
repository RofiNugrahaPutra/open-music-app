const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

/* eslint no-underscore-dangle: 0 */
class AuthenticationService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    await this._pool.query({
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    });
  }

  async verifyRefreshToken(token) {
    const result = await this._pool.query({
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    });

    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    await this._pool.query({
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    });
  }
}

module.exports = AuthenticationService;
