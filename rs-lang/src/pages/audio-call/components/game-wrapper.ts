import List from 'pages/audio-call/components/list';
import Button from 'pages/audio-call/components/button';
import BaseComponent from 'common-components/base-component';
import { DIFFICULTY_LEVELS, BUTTON_TEXT } from 'pages/audio-call/_constants';

class GameWindow extends BaseComponent {
  private gameContainer: BaseComponent<HTMLElement>;

  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.createContainer();
  }

  createContainer() {
    this.gameContainer = new BaseComponent(this.node, 'div', 'audio-game');
    this.createTitle('Аудиовызов');
    this.createDescription('Данная игра поможет улучшить ваше восприятие речи на слух');
    this.createLevelText('Выберите уровень сложности');
    const levelsList = new List(this.gameContainer.node, 6);
    const button = new Button(this.gameContainer.node, BUTTON_TEXT.start);
  }

  createTitle(name: string) {
    const title = new BaseComponent(this.gameContainer.node, 'h1', 'audio-game__name').node;
    title.innerHTML = name;
  }

  createDescription(text: string) {
    const description = new BaseComponent(this.gameContainer.node, 'p', 'audio-game__description').node;
    description.innerHTML = text;
  }

  createLevelText(text: string) {
    const levelText = new BaseComponent(this.gameContainer.node, 'span', 'audio-game__choice').node;
    levelText.innerHTML = text;
  }
}

export default GameWindow;
