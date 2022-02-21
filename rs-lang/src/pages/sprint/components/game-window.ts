/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
import Data from 'services/api-sprint';
import GameView from 'pages/sprint/components/game-view';
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
  difficultyLevel: number;
  gameStarted: boolean;
  gameView: GameView;
  page: number;

  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.createContainer();
    this.addHotKeys();
    this.correctWordData = null;
    this.difficultyLevel = null;
    this.gameStarted = false;
    this.page = null;
  }

  addHotKeys() {
    document.addEventListener('keydown', event => {
      switch (event.code) {
        case 'Digit1': this.showSelectedLevel(0);
          break;
        case 'Digit2': this.showSelectedLevel(1);
          break;
        case 'Digit3': this.showSelectedLevel(2);
          break;
        case 'Digit4': this.showSelectedLevel(3);
          break;
        case 'Digit5': this.showSelectedLevel(4);
          break;
        case 'Digit6': this.showSelectedLevel(5);
          break;
      }

      if (event.code === 'ArrowRight') {
        this.gameView.handleUserClick(this.gameView.randomTranslation, 'верно');
      }

      if (event.code === 'ArrowLeft') {
        this.gameView.handleUserClick(this.gameView.randomTranslation, 'неверно');
      }

      if (event.code === 'Enter' && this.difficultyLevel !== null && this.gameStarted === false) {
        this.handleButtonClick();
      }
    });
  }

  async generateWordsOptions(page: number, group: number) {
    const data = new Data();
    this.wordsData = await data.getData(page, group);
    this.correctWordData = this.wordsData[this.levelIndex];
    return this.wordsData;
  }

  showSelectedLevel(index: number) {
    this.page = Math.trunc(Math.random() * 30);
    this.difficultyLevel = index;
    const selectedLevel = this.levelsList.itemsArray[this.difficultyLevel];
    this.levelsList.itemsArray.splice(this.difficultyLevel, 1);
    selectedLevel.classList.add('active');
    this.levelsList.itemsArray.forEach(item => item.classList.add('invisible'));
    this.generateWordsOptions(this.page, this.difficultyLevel);
  }

  onLevelClick(info: IVariantInfo) {
    const target = info.target as HTMLElement;

    if (!target.closest('li')) return;
    this.showSelectedLevel(info.index);
  }

  createTextLine(block: HTMLElement, content: string, titleName: string, className: string) {
    const title = new BaseComponent(block, titleName, className).node;
    title.innerHTML = content;
  }

  onSoundButtonClick(url: string) {
    const audioObject = new Audio(`https://react-learnwords-example.herokuapp.com/${url}`);
    audioObject.play();
  }

  createWrongResultsList(resultsContainer: HTMLElement, userAnswersCount: IUserAnswersCount) {
    this.createTextLine(resultsContainer, 'Heправильные ответы', 'h6', 'sprint-game__results__wrong-name');

    const wrongAnswersArray: Array<string> = [];
    userAnswersCount.wrong.forEach(item => {
      wrongAnswersArray.push(item.meaning);
    });

    const answersCount = new BaseComponent(resultsContainer, 'span', 'wrong-answer__count').node;
    answersCount.innerText = String(wrongAnswersArray.length);

    const wrongResults = new List(resultsContainer, wrongAnswersArray, info => this.onSoundButtonClick(
      userAnswersCount.wrong[info.index].audio
    ));
    wrongResults.createContainer('sprint-game__results__wrong', 'result-word');
  }

  createCorrectResultsList(resultsContainer: HTMLElement, userAnswersCount: IUserAnswersCount) {
    this.createTextLine(resultsContainer, 'Правильные ответы', 'h6', 'sprint-game__results__correct-name');

    const correctAnswersArray: Array<string> = [];
    userAnswersCount.correct.forEach(item => {
      correctAnswersArray.push(item.meaning);
    });

    const answersCount = new BaseComponent(resultsContainer, 'span', 'correct-answer__count').node;
    answersCount.innerText = String(correctAnswersArray.length);

    const correctResults = new List(
      resultsContainer,
      correctAnswersArray,
      info => this.onSoundButtonClick(userAnswersCount.correct[info.index].audio)
    );
    correctResults.createContainer('sprint-game__results__correct', 'result-word');
  }

  onPlayAgainButtonClick() {
    this.gameContainer.destroy();
    this.correctWordData = null;
    this.difficultyLevel = null;
    this.gameStarted = false;
    this.createContainer();
  }

  showResults(userAnswersCount: IUserAnswersCount) {
    this.gameContainer.destroy();
    this.gameContainer = new BaseComponent(this.node, 'div', 'sprint-game__results');

    this.createTextLine(this.gameContainer.node, 'Спринт', 'h4', 'sprint-game__level-name');

    const resultsContainer = new BaseComponent(this.gameContainer.node, 'div', 'sprint-game__results-container').node;

    this.createTextLine(resultsContainer, 'Результаты', 'h5', 'sprint-game__results-name');
    this.createTextLine(resultsContainer, `Набрано ${this.gameView.score} очков`, 'h5', 'game-total');

    this.createWrongResultsList(resultsContainer, userAnswersCount);
    this.createCorrectResultsList(resultsContainer, userAnswersCount);

    const buttonsContainer = new BaseComponent(resultsContainer, 'div', 'buttons-container').node;

    const playAgainButton = new BaseComponent(buttonsContainer, 'button', 'sprint-game__button', BUTTON_TEXT.again).node;
    playAgainButton.addEventListener('click', () => this.onPlayAgainButtonClick());

    const textBookButton = new BaseComponent(buttonsContainer, 'button', 'sprint-game__button', BUTTON_TEXT.toTextbook).node;
    textBookButton.addEventListener('click', () => {
      window.location.href = '#textbook';
    });
  }

  handleButtonClick() {
    if (!this.gameStarted) {
      this.gameContainer.destroy();
      this.gameContainer = new BaseComponent(this.node, 'div', 'sprint-game__level');
      this.createTextLine(this.gameContainer.node, 'Спринт', 'h4', 'sprint-game__level-name');
      this.gameView = new GameView(this.gameContainer.node, this.wordsData, () => this.showResults(this.gameView.userAnswersCount));
      this.gameView.createScoreContainer();
      this.gameView.createTimer();
      this.gameView.createAnswers();

      const buttonsContainer = new BaseComponent(this.gameContainer.node, 'div', 'buttons-container');

      const wrongButton = new BaseComponent(buttonsContainer.node, 'button', 'sprint-game__button wrong-answer', BUTTON_TEXT.wrong).node;
      wrongButton.addEventListener('click', () => this.gameView.handleUserClick(this.gameView.randomTranslation, wrongButton.innerHTML));

      const correctButton = new BaseComponent(buttonsContainer.node, 'button', 'sprint-game__button  correct-answer', BUTTON_TEXT.correct).node;
      correctButton.addEventListener('click', () => this.gameView.handleUserClick(this.gameView.randomTranslation, correctButton.innerHTML));

      this.gameStarted = true;
    } else {
      this.gameView.updateRoundInfo();
    }
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
      this.handleButtonClick();
    });
  }
}

export default GameWindow;
