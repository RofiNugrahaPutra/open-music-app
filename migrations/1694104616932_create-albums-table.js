/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('albums', {
    album_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
