import List from 'pages/audio-call/components/list';
import Button from 'pages/audio-call/components/button';
import BaseComponent from 'common-components/base-component';
import { DIFFICULTY_LEVELS, BUTTON_TEXT } from 'pages/audio-call/_constants';
import { IListClickInfo, IWordData } from 'types/interfaces';
import LevelData from './level-data';

class GameWindow extends BaseComponent {
  private gameContainer: BaseComponent<HTMLElement>;
  levelsList: List;
  levelWords: LevelData;
  wordsData: Array<IWordData>;
  answers: Array<string>;
  levelCount: number;

  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.levelWords = new LevelData();
    this.createContainer();
    this.levelCount = 0;
  }

  createContainer() {
    this.gameContainer = new BaseComponent(this.node, 'div', 'audio-game');
    this.createTitle('Аудиовызов', 'h1', 'audio-game__name');
    this.createDescription('Данная игра поможет улучшить ваше восприятие речи на слух');
    this.createLevelText('Выберите уровень сложности');
    this.levelsList = new List(this.gameContainer.node, DIFFICULTY_LEVELS, level => this.onLevelClick(level));
    this.levelsList.createContainer('audio-game__level-choice', 'audio-game__level-button');
    const button = new Button(this.gameContainer.node);
    const startButton: HTMLElement = button.createButton(BUTTON_TEXT.start, 'audio-game__start');
    startButton.addEventListener('click', () => this.onStartButtonClick());
  }

  async onLevelClick(info: IListClickInfo) {
    console.log(info);
    const target = info.event.target as HTMLElement;
    if (!(target.closest('li'))) return;
    const targetNum = info.index;
    this.levelsList.itemsArray.splice(targetNum, 1);
    this.levelsList.itemsArray.forEach(item => item.classList.add('invisible'));

    this.wordsData = await this.levelWords.getWordsData(targetNum);
    this.answers = this.levelWords.generateAnswers(this.wordsData);
    this.answers.push(this.wordsData[this.levelCount].wordTranslate);
    this.levelCount += 1;
  }

  onStartButtonClick() {
    this.gameContainer.destroy();
    this.gameContainer = new BaseComponent(this.node, 'div', 'audio-game__level');
    this.createTitle('Аудиовызов', 'h4', 'audio-game__level-name');
    const soundButton = new BaseComponent(this.gameContainer.node, 'div', 'audio-game__sound-button');
    const levelOptions = new List(this.gameContainer.node, this.answers.sort(), info => this.onVariantClick(info));
    levelOptions.createContainer('audio-game__level-options', 'level-option');
    const button = new Button(this.gameContainer.node);
    const skipButton: HTMLElement = button.createButton(BUTTON_TEXT.skip, 'audio-game__button');
  }

  onVariantClick(info: IListClickInfo): void {
    console.log(info);
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
