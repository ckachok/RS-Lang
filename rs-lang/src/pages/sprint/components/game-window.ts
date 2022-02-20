/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
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
  points: number;
  score: number;
  correctSequence: number;
  timer: number;

  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.createContainer();
    this.levelIndex = 0;
    this.correctWordData = null;
    this.userAnswersCount = { correct: [], wrong: [] };
    this.difficultyLevel = null;
    this.gameStarted = false;
    this.points = 10;
    this.score = 0;
    this.correctSequence = 0;
    this.timer = 6;
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

  generateRandomTranslation() {
    const randomTime = Math.trunc(Math.random() * 4);
    const randomNumber = Math.trunc(Math.random() * 20);
    const randomWord = randomTime === 3 ? this.correctWordData.wordTranslate : this.wordsData[randomNumber].wordTranslate;
    return randomWord;
  }

  getVariantInfo(num: number): IVariantInfo {
    const variantsArray: Array<HTMLElement> = Array.from(document.querySelectorAll('.level-option'));
    const info : IVariantInfo = {
      index: num,
      target: variantsArray[num],
      label: variantsArray[num].innerText,
    };
    return info;
  }

  addHotKeys() {
    document.addEventListener('keydown', event1 => {
      switch (event1.code) {
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

      if (event1.code === 'Enter' && this.correctWordData !== null && this.gameStarted === true) {
        this.onActionButtonClick();
      }

      if (event1.code === 'Enter' && this.difficultyLevel !== null && this.gameStarted === false) {
        this.onStartButtonClick();
      }
    });
  }

  async handleUserClick(translation: string, userAnswer: string) {
    const answer = {
      meaning: `<strong>${this.correctWordData.word}</strong> - ${this.correctWordData.wordTranslate}`,
      audio: this.correctWordData.audio,
    };
    if ((userAnswer === 'верно' && this.correctWordData.wordTranslate === translation) || (userAnswer === 'неверно' && this.correctWordData.wordTranslate !== translation)) {
      this.updateScore();
      this.userAnswersCount.correct.push(answer);
    } else {
      this.userAnswersCount.wrong.push(answer);
      this.correctSequence = 0;
    }
    this.onActionButtonClick();
  }

  updateScore() {
    if (this.correctSequence === 3) {
      this.points *= 2;
      this.correctSequence = 0;
    }
    this.score += this.points;
    this.correctSequence += 1;
  }

  colorCircles() {
    const paginationCircles = Array.from(document.querySelectorAll('.pagination-circle'));

    if (!paginationCircles[0].classList.contains('correct-answer') && this.correctSequence > 0) {
      paginationCircles[0].classList.add('correct-answer');
      if (!paginationCircles[1].classList.contains('correct-answer') && this.correctSequence > 1) {
        paginationCircles[1].classList.add('correct-answer');
        if (!paginationCircles[2].classList.contains('correct-answer') && this.correctSequence > 2) {
          paginationCircles[2].classList.add('correct-answer');
        }
      }
    }
  }

  createWrongResultsList(resultsContainer: HTMLElement) {
    this.createTextLine(resultsContainer, 'Heправильные ответы', 'h6', 'sprint-game__results__wrong-name');

    const wrongAnswersArray: Array<string> = [];
    this.userAnswersCount.wrong.forEach(item => {
      wrongAnswersArray.push(item.meaning);
    });

    const answersCount = new BaseComponent(resultsContainer, 'span', 'wrong-answer__count').node;
    answersCount.innerText = String(wrongAnswersArray.length);

    const wrongResults = new List(resultsContainer, wrongAnswersArray, info => this.onSoundButtonClick(
      this.userAnswersCount.wrong[info.index].audio
    ));
    wrongResults.createContainer('sprint-game__results__wrong', 'result-word');
  }

  onSoundButtonClick(url: string) {
    const audioObject = new Audio(`https://react-learnwords-example.herokuapp.com/${url}`);
    audioObject.play();
  }

  createCorrectResultsList(resultsContainer: HTMLElement) {
    const correctAnswersArray: Array<string> = [];
    this.userAnswersCount.correct.forEach(item => {
      correctAnswersArray.push(item.meaning);
    });

    this.createTextLine(resultsContainer, 'Правильные ответы', 'h6', 'sprint-game__results__correct-name');

    const answersCount = new BaseComponent(resultsContainer, 'span', 'correct-answer__count').node;
    answersCount.innerText = String(correctAnswersArray.length);

    const correctResults = new List(
      resultsContainer,
      correctAnswersArray,
      info => this.onSoundButtonClick(this.userAnswersCount.correct[info.index].audio)
    );
    correctResults.createContainer('sprint-game__results__correct', 'result-word');
  }

  onPlayAgainButtonClick() {
    this.gameContainer.destroy();
    this.levelIndex = 0;
    this.correctWordData = null;
    this.userAnswersCount = { correct: [], wrong: [] };
    this.difficultyLevel = null;
    this.gameStarted = false;
    this.points = 10;
    this.score = 0;
    this.correctSequence = 0;
    this.createContainer();
  }

  showResults() {
    this.gameContainer.destroy();
    this.gameContainer = new BaseComponent(this.node, 'div', 'sprint-game__results');

    this.createTextLine(this.gameContainer.node, 'Спринт', 'h4', 'sprint-game__level-name');

    const resultsContainer = new BaseComponent(this.gameContainer.node, 'div', 'sprint-game__results-container').node;

    this.createTextLine(resultsContainer, 'Результаты', 'h5', 'sprint-game__results-name');

    this.createWrongResultsList(resultsContainer);
    this.createCorrectResultsList(resultsContainer);

    const buttonsContainer = new BaseComponent(resultsContainer, 'div', 'buttons-container').node;

    const playAgainButton = new BaseComponent(buttonsContainer, 'button', 'sprint-game__button', BUTTON_TEXT.again).node;
    playAgainButton.addEventListener('click', () => this.onPlayAgainButtonClick());

    const textBookButton = new BaseComponent(buttonsContainer, 'button', 'sprint-game__button', BUTTON_TEXT.toTextbook).node;
    textBookButton.addEventListener('click', () => {
      window.location.href = '#textbook';
    });
  }

  async onActionButtonClick() {
    if (this.levelIndex === 8) {
      this.showResults();
    } else {
      await this.generateWordsOptions(this.difficultyLevel);
      this.onStartButtonClick();
    }
  }

  onStartButtonClick() {
    this.gameContainer.destroy();
    this.gameContainer = new BaseComponent(this.node, 'div', 'sprint-game__level');

    const randomTranslation = this.generateRandomTranslation();

    this.createTextLine(this.gameContainer.node, 'Спринт', 'h4', 'sprint-game__level-name');

    this.createScoreContainer();
    this.createTimer();

    this.createTextLine(this.gameContainer.node, this.correctWordData.word, 'span', 'round-word');
    this.createTextLine(this.gameContainer.node, randomTranslation, 'span', 'round-word-translation');

    const buttonsContainer = new BaseComponent(this.gameContainer.node, 'div', 'buttons-container');

    const wrongButton = new BaseComponent(buttonsContainer.node, 'button', 'sprint-game__button wrong-answer', BUTTON_TEXT.wrong).node;
    wrongButton.addEventListener('click', () => this.handleUserClick(randomTranslation, wrongButton.innerHTML));

    const correctButton = new BaseComponent(buttonsContainer.node, 'button', 'sprint-game__button  correct-answer', BUTTON_TEXT.correct).node;
    correctButton.addEventListener('click', () => this.handleUserClick(randomTranslation, correctButton.innerHTML));

    this.gameStarted = true;
  }

  createTimer() {
    const timerContainer = new BaseComponent(this.gameContainer.node, 'div', 'timer-container').node;
    const timerCount = new BaseComponent(timerContainer, 'span', 'timer-count').node;
    const gameTimer = setInterval(() => {
      timerCount.innerHTML = String(this.timer -= 1);
      if (this.timer === 0) {
        this.showResults();
        clearInterval(gameTimer);
      }
    }, 1000);
  }

  createScoreContainer() {
    const scoreContainer = new BaseComponent(this.gameContainer.node, 'div', 'score-container').node;

    this.createTextLine(scoreContainer, String(this.score), 'span', 'score-amount');

    const pagination = new BaseComponent(scoreContainer, 'div', 'pagination').node;
    this.createTextLine(pagination, '', 'span', 'pagination-circle');
    this.createTextLine(pagination, '', 'span', 'pagination-circle');
    this.createTextLine(pagination, '', 'span', 'pagination-circle');

    this.colorCircles();

    this.createTextLine(scoreContainer, `+${this.points} очков за слово`, 'span', 'points-amount');
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
