import path from 'path';
import fetchSongMetadata from '../helpers/fetch-song-metadata';
import config from '../config';

const convertMp3ToM4a = (mp3Url, outputFileName) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = require('fluent-ffmpeg');
    const command = ffmpeg()
      .input(mp3Url)
      .output(path.join(config.localAudioCacheFolderName, outputFileName))
      .audioCodec('aac')
      .audioBitrate('128k')
      .on('start', cli => console.log('Start with ' + cli))
      .on('progress', progress =>
        console.log('Processing - ' + JSON.stringify(progress))
      )
      .on('error', err => reject(err))
      .on('end', stdout => resolve(outputFileName))
      .run();
  });
};

const m4aProviderMiddleware = (request, response) => {
  const hashedSongId = request.params.id;
  fetchSongMetadata(hashedSongId)
    .then(songMetadata =>
      convertMp3ToM4a(songMetadata.trialUrl, songMetadata.hashedSongId + '.m4a')
    )
    .then(res => {
      response.json({
        m4aFilePath: `/${config.staticAudioFolderName}/${res}`
      });
    })
    .catch(err => {
      response.status(400).json({
        error: 'unknown error'
      });
    });
};

export default m4aProviderMiddleware;
