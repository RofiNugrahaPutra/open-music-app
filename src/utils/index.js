/* eslint-disable camelcase */
const mapAlbumModel = ({
  album_id,
  name,
  year,
}) => ({
  albumId: album_id,
  name,
  year,
});

const mapSongModel = ({
  song_id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  songId: song_id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

exports.module = { mapAlbumModel, mapSongModel };
