import requestPromise from 'request-promise';

const removeSongNameHtmlTransform = song => ({
  ...song,
  song_name: song.song_name.replace(/<.*?>/g, '')
});
const fullUrlTransform = song => {
  const nextSong = { ...song };
  const domainName = 'https://www.kkbox.com';
  nextSong.album_url = domainName + song.album_url;
  nextSong.song_url = domainName + song.song_url;
  nextSong.artist_url = domainName + song.artist_url;
  return nextSong;
};
const extractHashedSongIdTransform = song => ({
  ...song,
  hashed_song_id: song.song_url.match(/song\/(.*?)-index.html/)[1]
});
const extractHashedAlbumIdTransform = song => ({
  ...song,
  hashed_album_id: song.album_url.match(/album\/(.*?)-index.html/)[1]
});
const extractHashedArtistIdTransform = song => ({
  ...song,
  hashed_artist_id: song.artist_url.match(/artist\/(.*?)-index-1.html/)[1]
});

const searchMiddleware = (request, response) => {
  const searchTerm = request.params.term;
  const searchUrl = `https://www.kkbox.com/tw/tc/ajax/search_suggestion.php?query=${encodeURIComponent(
    searchTerm
  )}&sf=song_name`;

  requestPromise({
    uri: searchUrl
  })
    .then(body => {
      const transformedJson = JSON.parse(body)
        .map(removeSongNameHtmlTransform)
        .map(fullUrlTransform)
        .map(extractHashedSongIdTransform)
        .map(extractHashedAlbumIdTransform)
        .map(extractHashedArtistIdTransform);

      response.header('Content-Type', 'application/json; charset=utf-8');
      response.send(transformedJson);
    })
    .catch(err => {
      console.error(err);
      response.status(400).json({
        error: 'unknown error'
      });
    });
};

export default searchMiddleware;
