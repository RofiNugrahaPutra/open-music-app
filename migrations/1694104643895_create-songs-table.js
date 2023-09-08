/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(24)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    year: {
      type: 'SMALLINT',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    duration: {
      type: 'INT',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(24)',
      reference: 'albums(album_id)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
