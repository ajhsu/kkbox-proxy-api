module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: "kkbox-proxy-api",
      script: "index.js",
      watch: ['lib'],
      ignore_watch: ["audio_caches"]
    }
  ]
}
