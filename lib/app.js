import express from 'express';
import cors from 'cors';
import searchMiddleware from './entries/search';
import songMiddleware from './entries/song';
import albumMiddleware from './entries/album';
import playlistMiddleware from './entries/playlist';
import m4aProviderMiddleware from './entries/trial-m4a-provider';
import config from './config';
import { fileLogger, stdoutLogger } from './logger';

const app = express();

// Apply CORS middleware
app.use(cors());

// Apply logger middleware
app.use(fileLogger);
app.use(stdoutLogger);

// Serve static audio files
app.use(
  `/${config.staticAudioFolderName}`,
  express.static(config.localAudioCacheFolderName)
);
// Search API
app.get('/search/:term', searchMiddleware);
// Song Metadata API
app.get('/song/:id', songMiddleware);
// Album Metadata API
app.get('/album/:id', albumMiddleware);
// Playlist Metadata API
app.get('/playlist/:id', playlistMiddleware);
// M4A Trial Provider API
app.get('/m4a-provider/:id', m4aProviderMiddleware);
// Catch all other requests
app.get('*', (request, response) => {
  response.status(404).send('Route not found');
});

app.listen(config.port, () => {
  console.log(`Node-server start to listen on port ${config.port}..`);
});
