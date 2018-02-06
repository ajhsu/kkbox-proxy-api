import fetchSongMetadata from '../helpers/fetch-song-metadata';

const songMiddleware = (request, response) => {
  const hashedSongId = request.params.id;
  fetchSongMetadata(hashedSongId)
    .then(songMetadata => response.json(songMetadata))
    .catch(err => {
      console.error(err);
      response.status(400).json({
        error: 'unknown error'
      });
    });
};

export default songMiddleware;
