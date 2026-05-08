import { createApp } from './app.js';
import { config } from './config.js';

createApp().listen(config.PORT, config.HOST, () => {
  console.log(`Duribeon backend started: http://${config.HOST}:${config.PORT}`);
});
