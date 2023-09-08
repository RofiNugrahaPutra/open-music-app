/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    song_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INTERVAL',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      reference: 'albums(album_id)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
