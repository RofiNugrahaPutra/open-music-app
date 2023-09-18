/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(48)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    fullname: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
