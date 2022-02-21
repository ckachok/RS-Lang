/* eslint-disable max-len */
import BaseComponent from '../../../common-components/base-component';
import { IUserAnswersCount, IWordData } from '../../../types/interfaces';

class GameView {
  onTimerFinished: (userAnswersCount: IUserAnswersCount) => void;
  container: HTMLElement;
  gameTimer: NodeJS.Timer;
  timer: number;
  word: HTMLElement;
  wordTranslation: HTMLElement;
  data: Array<IWordData>;
  randomTranslation: string;
  correctWordData: IWordData;
  score: number;
  points: number;
  correctSequence: number;
  userAnswersCount: IUserAnswersCount;
  levelIndex: number;
  scoreAmount: HTMLElement;
  pointsAmount: HTMLElement;

  constructor(container: HTMLElement, data: Array<IWordData>, onTimerFinished: () => void) {
    this.container = container;
    this.data = data;
    this.levelIndex = 0;
    this.randomTranslation = this.generateRandomTranslation();
    this.correctWordData = this.data[this.levelIndex];
    this.word = null;
    this.wordTranslation = null;
    this.onTimerFinished = onTimerFinished;
    this.userAnswersCount = { correct: [], wrong: [] };
    this.timer = 30;
    this.points = 10;
    this.score = 0;
    this.correctSequence = 0;
    this.scoreAmount = null;
    this.pointsAmount = null;
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

    paginationCircles.forEach(circle => {
      if (paginationCircles.indexOf(circle) < this.correctSequence) {
        circle.classList.add('correct-answer');
      } else {
        circle.classList.remove('correct-answer');
      }
    });
  }

  generateRandomTranslation() {
    const randomTime = Math.trunc(Math.random() * 2);
    const randomNumber = Math.trunc(Math.random() * 20);
    this.correctWordData = this.data[this.levelIndex];
    const randomWord = randomTime === 1 ? this.correctWordData.wordTranslate : this.data[randomNumber].wordTranslate;
    return randomWord;
  }

  updateRoundInfo() {
    this.correctWordData = this.data[this.levelIndex];
    this.word.innerHTML = this.correctWordData.word;
    this.randomTranslation = this.generateRandomTranslation();
    this.wordTranslation.innerHTML = this.randomTranslation;
    this.scoreAmount.innerHTML = String(this.score);
    this.pointsAmount.innerHTML = `+${this.points} очков за слово`;
  }

  async handleUserClick(translation: string, userAnswer: string) {
    this.levelIndex += 1;
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
      this.points = 10;
    }
    this.colorCircles();
    this.updateRoundInfo();
  }

  createAnswers() {
    this.word = this.createTextLine(this.container, this.correctWordData.word, 'span', 'round-word');
    this.wordTranslation = this.createTextLine(this.container, this.randomTranslation, 'span', 'round-word-translation');
  }

  createTimer() {
    const timerContainer = new BaseComponent(this.container, 'div', 'timer-container').node;
    const timerCount = new BaseComponent(timerContainer, 'span', 'timer-count').node;
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    timerCount.innerHTML = String(this.timer);

    this.gameTimer = setInterval(() => {
      timerCount.innerHTML = String(this.timer -= 1);
      if (this.timer === 0) {
        this.onTimerFinished(this.userAnswersCount);
        if (this.gameTimer) {
          clearInterval(this.gameTimer);
        }
      }
    }, 1000);
  }

  createScoreContainer() {
    const scoreContainer = new BaseComponent(this.container, 'div', 'score-container').node;

    this.scoreAmount = this.createTextLine(scoreContainer, String(this.score), 'span', 'score-amount');

    const pagination = new BaseComponent(scoreContainer, 'div', 'pagination').node;
    this.createTextLine(pagination, '', 'span', 'pagination-circle');
    this.createTextLine(pagination, '', 'span', 'pagination-circle');
    this.createTextLine(pagination, '', 'span', 'pagination-circle');

    this.pointsAmount = this.createTextLine(scoreContainer, `+${this.points} очков за слово`, 'span', 'points-amount');
  }

  createTextLine(block: HTMLElement, content: string, titleName: string, className: string) {
    const title = new BaseComponent(block, titleName, className).node;
    title.innerHTML = content;
    return title;
  }
}

export default GameView;
