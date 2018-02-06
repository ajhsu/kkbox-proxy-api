import requestPromise from 'request-promise';
const escapeGoat = require('escape-goat');

const fetchSongMetadata = hashedSongId => {
  const pageUrl = `https://www.kkbox.com/tw/tc/song/${hashedSongId}-index.html`;
  return requestPromise({
    uri: pageUrl
  })
    .then(body => {
      const description = body.match(
        /<meta property="og:description" content="(.*?)"/i
      )[1];
      const songId = body.match(/kkbox\:\/\/play\_song\_([0-9]+)/i)[1];
      const artistName = description.match(
        /(.*?)收錄在(.*?)中的「(.*?)」介紹，快打開 KKBOX 聽聽看這首歌吧！/i
      )[1];
      const albumName = description.match(
        /(.*?)收錄在(.*?)中的「(.*?)」介紹，快打開 KKBOX 聽聽看這首歌吧！/i
      )[2];
      const songName = body.match(
        /<meta property="og:title" content="(.*?)"/i
      )[1];
      const albumCover = body.match(
        /<meta property="og:image" content="(.*?)"/i
      )[1];
      const trialUrl = body.match(
        /<meta property="music:preview_url:secure_url" content="(.*?)"/i
      )[1];
      const lyrics = body
        .match(/<div class="lyrics.*?>(.|\n|\r)*?<\/div>/gim)[0]
        .replace(/<.*?>/g, '')
        .trim();

      return {
        artistName,
        albumName,
        songName,
        albumCover,
        hashedSongId,
        songId,
        trialUrl,
        lyrics
      };
    })
    .catch(err => {
      console.error(err);
    });
};

export default fetchSongMetadata;
