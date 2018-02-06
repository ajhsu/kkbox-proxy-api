import requestPromise from 'request-promise';

const playlistMiddleware = (request, response) => {
  const hashedPlaylistId = request.params.id;
  const pageUrl = `https://www.kkbox.com/tw/tc/playlist/${hashedPlaylistId}`;
  requestPromise({
    uri: pageUrl
  })
    .then(body => {
      const playlistName = body.match(
        /<meta property="og:title" content="(.*?)"/i
      )[1];
      const playlistDescription = body.match(
        /<meta property="og:description" content="(.*?)"/i
      )[1];
      const playlistCover = body.match(
        /<meta property="og:image" content="(.*?)"/i
      )[1];
      const songList = JSON.parse(
        body.match(/KKBOX.SongMeta = (\{.*?\});/i)[1]
      );
      response.json({
        playlistName,
        playlistDescription,
        playlistCover,
        songList
      });
    })
    .catch(err => {
      console.error(err);
      response.status(400).json({
        error: 'unknown error'
      });
    });
};

export default playlistMiddleware;
