import 'normalize.css';
import './styles.scss';
import App from './app';
import { playback } from 'pages/textbook/components/card/card';

const app = new App();

document.addEventListener('DOMContentLoaded', () => {
  app.router();
});

window.addEventListener('hashchange', () => {
  playback.pause();
  app.router();
});
