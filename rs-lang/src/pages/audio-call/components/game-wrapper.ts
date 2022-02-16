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
    this.createTitle('Аудиовызов', 'h1', 'audio-game__name');
    this.createDescription('Данная игра поможет улучшить ваше восприятие речи на слух');
    this.createLevelText('Выберите уровень сложности');
    const levelsList = new List(this.gameContainer.node, DIFFICULTY_LEVELS.length);
    levelsList.createContainer('audio-game__level-choice', 'audio-game__level-button');
    const button = new Button(this.gameContainer.node);
    const startButton: HTMLElement = button.createButton(BUTTON_TEXT.start, 'audio-game__start');
    this.onButtonClick(startButton, () => this.createGameLevel());
  }

  onButtonClick(button: HTMLElement, callbackFunction: () => void) {
    button.addEventListener('click', () => callbackFunction());
  }

  createGameLevel() {
    this.gameContainer.destroy();
    this.gameContainer = new BaseComponent(this.node, 'div', 'audio-game__level');
    this.createTitle('Аудиовызов', 'h4', 'audio-game__level-name');
    const soundButton = new BaseComponent(this.gameContainer.node, 'div', 'audio-game__sound-button');
    const levelOptions = new List(this.gameContainer.node, 5);
    levelOptions.createContainer('audio-game__level-options', 'level-option');
    const button = new Button(this.gameContainer.node);
    const skipButton: HTMLElement = button.createButton(BUTTON_TEXT.skip, 'audio-game__button');
  }

  createTitle(name: string, titleName: string, className: string) {
    const title = new BaseComponent(this.gameContainer.node, titleName, className).node;
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
