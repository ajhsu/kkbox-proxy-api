import requestPromise from 'request-promise';

const albumMiddleware = (request, response) => {
  const hashedAlbumId = request.params.id;
  const pageUrl = `https://www.kkbox.com/tw/tc/album/${hashedAlbumId}-index.html`;
  requestPromise({
    uri: pageUrl
  })
    .then(body => {
      const albumName = body.match(
        /<meta property="og:title" content="(.*?)"/i
      )[1];
      const albumDescription = body.match(
        /<meta property="og:description" content="(.*?)"/i
      )[1];
      const albumCover = body.match(
        /<meta property="og:image" content="(.*?)"/i
      )[1];
      const songList = JSON.parse(
        body.match(/KKBOX.SongMeta = (\{.*?\});/i)[1]
      );
      response.json({
        albumName,
        albumDescription,
        albumCover,
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

export default albumMiddleware;
