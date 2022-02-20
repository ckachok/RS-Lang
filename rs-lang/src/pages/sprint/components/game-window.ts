import Data from 'services/api-sprint';
import List from './list';
import BaseComponent from '../../../common-components/base-component';
import { DIFFICULTY_LEVELS, BUTTON_TEXT } from '../_constants';
import { IVariantInfo, IUserAnswersCount, IWordData } from '../../../types/interfaces';

class GameWindow extends BaseComponent {
  private gameContainer: BaseComponent<HTMLElement>;
  levelsList: List;
  wordsData: Array<IWordData>;
  answers: Array<string>;
  levelIndex: number;
  correctWordData: IWordData;
  userAnswersCount: IUserAnswersCount;
  difficultyLevel: number;
  gameStarted: boolean;

  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.createContainer();
    this.levelIndex = 0;
    this.correctWordData = null;
    this.userAnswersCount = { correct: [], wrong: [] };
    this.difficultyLevel = null;
    this.gameStarted = false;
  }

  createTextLine(block: HTMLElement, content: string, titleName: string, className: string) {
    const title = new BaseComponent(block, titleName, className).node;
    title.innerHTML = content;
  }

  onLevelClick(info: IVariantInfo) {
    const target = info.target as HTMLElement;

    if (!target.closest('li')) return;
    this.showSelectedLevel(info.index);
  }

  showSelectedLevel(index: number) {
    this.difficultyLevel = index;
    this.levelsList.itemsArray.splice(this.difficultyLevel, 1);
    this.levelsList.itemsArray.forEach(item => item.classList.add('invisible'));
    this.generateWordsOptions(this.difficultyLevel);
  }

  async generateWordsOptions(targetNum: number) {
    const data = new Data();
    this.wordsData = await data.getData(1, targetNum);
    this.correctWordData = this.wordsData[this.levelIndex];
    this.levelIndex += 1;
  }

  onStartButtonClick() {
    this.gameContainer.destroy();
    this.gameContainer = new BaseComponent(this.node, 'div', 'sprint-game__level');

    this.createTextLine(this.gameContainer.node, 'Спринт', 'h4', 'sprint-game__level-name');

    this.createTextLine(this.gameContainer.node, this.correctWordData.word, 'span', 'round-word');
    this.createTextLine(this.gameContainer.node, this.correctWordData.wordTranslate, 'span', 'round-word-translation');

    const buttonsContainer = new BaseComponent(this.gameContainer.node, 'div', 'buttons-container');

    const wrongButton = new BaseComponent(buttonsContainer.node, 'button', 'wrong-answer', BUTTON_TEXT.wrong).node;
    const correctButton = new BaseComponent(buttonsContainer.node, 'button', 'correct-answer', BUTTON_TEXT.correct).node;

    this.gameStarted = true;
  }

  createContainer() {
    this.gameContainer = new BaseComponent(this.node, 'div', 'sprint-game');

    this.createTextLine(this.gameContainer.node, 'Спринт', 'h1', 'game__name');
    this.createTextLine(this.gameContainer.node, 'Данная игра тренирует навык быстрого перевода', 'p', 'sprint-game__description');

    const levelText = new BaseComponent(this.gameContainer.node, 'span', 'sprint-game__choice').node;
    levelText.innerHTML = 'Выберите уровень сложности';

    this.levelsList = new List(this.gameContainer.node, DIFFICULTY_LEVELS, level => this.onLevelClick(level));
    this.levelsList.createContainer('sprint-game__level-choice', 'sprint-game__level-button');

    const startButton = new BaseComponent(this.gameContainer.node, 'button', 'sprint-game__start', BUTTON_TEXT.start).node;
    startButton.addEventListener('click', () => {
      if (this.difficultyLevel === null) return;
      this.onStartButtonClick();
    });
  }
}

export default GameWindow;
