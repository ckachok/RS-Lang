import List from 'pages/audio-call/components/list';
import Button from 'pages/audio-call/components/button';
import BaseComponent from 'common-components/base-component';
import { DIFFICULTY_LEVELS, BUTTON_TEXT } from 'pages/audio-call/_constants';
import { IListClickInfo, IUserAnswersCount, IWordData } from 'types/interfaces';
import AudioSound from 'pages/audio-call/components/audio-sound';
import LevelData from 'pages/audio-call/components/level-data';

class GameWindow extends BaseComponent {
  private gameContainer: BaseComponent<HTMLElement>;
  levelsList: List;
  levelWords: LevelData;
  wordsData: Array<IWordData>;
  answers: Array<string>;
  levelIndex: number;
  correctWordData: IWordData;
  userAnswersCount: IUserAnswersCount;
  difficultyLevel: number;

  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.levelWords = new LevelData();
    this.createContainer();
    this.levelIndex = 0;
    this.correctWordData = null;
    this.userAnswersCount = { correct: 0, wrong: null };
    this.difficultyLevel = null;
  }

  createContainer() {
    this.gameContainer = new BaseComponent(this.node, 'div', 'audio-game');
    this.createTitle('Аудиовызов', 'h1', 'audio-game__name');
    this.createDescription(
      'Данная игра поможет улучшить ваше восприятие речи на слух'
    );
    this.createLevelText('Выберите уровень сложности');
    this.levelsList = new List(
      this.gameContainer.node,
      DIFFICULTY_LEVELS,
      level => this.onLevelClick(level)
    );
    this.levelsList.createContainer(
      'audio-game__level-choice',
      'audio-game__level-button'
    );
    const button = new Button(this.gameContainer.node);
    const startButton: HTMLElement = button.createButton(
      BUTTON_TEXT.start,
      'audio-game__start'
    );
    startButton.addEventListener('click', () => this.onStartButtonClick());
  }

  async onLevelClick(info: IListClickInfo) {
    const target = info.event.target as HTMLElement;
    if (!target.closest('li')) return;
    this.difficultyLevel = info.index;
    this.levelsList.itemsArray.splice(this.difficultyLevel, 1);
    this.levelsList.itemsArray.forEach(item => item.classList.add('invisible'));
    this.generateWordsOptions(this.difficultyLevel);
  }

  async generateWordsOptions(targetNum: number) {
    this.wordsData = await this.levelWords.getWordsData(targetNum);
    this.correctWordData = this.wordsData[this.levelIndex];
    const someArr = [];
    someArr.push(this.correctWordData.wordTranslate);
    this.answers = this.levelWords.generateAnswers(this.wordsData, someArr);
    this.levelIndex += 1;
  }

  onStartButtonClick() {
    this.gameContainer.destroy();
    this.gameContainer = new BaseComponent(
      this.node,
      'div',
      'audio-game__level'
    );
    this.createTitle('Аудиовызов', 'h4', 'audio-game__level-name');
    const soundButton = new Button(this.gameContainer.node);
    soundButton
      .createButton('', 'audio-game__sound-button');
    // .addEventListener('click', () => this.onSoundButtonClick());
    const levelOptions = new List(
      this.gameContainer.node,
      this.answers.sort(),
      info => this.onVariantClick(info)
    );
    levelOptions.createContainer('audio-game__level-options', 'level-option');
    const button = new Button(this.gameContainer.node);
    const actionButton: HTMLElement = button.createButton(
      BUTTON_TEXT.skip,
      'audio-game__button'
    );
    actionButton.addEventListener('click', () => this.actionButton(actionButton));
    // setTimeout(() => this.onSoundButtonClick(), 500);
  }

  async actionButton(actionButton: HTMLElement) {
    if (actionButton.innerText === BUTTON_TEXT.skip) {
      this.showCorrectAnswer();
    } else {
      await this.generateWordsOptions(this.difficultyLevel);
      this.onStartButtonClick();
    }
  }

  onSoundButtonClick() {
    const sound = new AudioSound();
    sound.playSound(this.correctWordData.audio);
  }

  onVariantClick(info: IListClickInfo): void {
    this.handleUserClick(info);
    this.showCorrectAnswer();
  }

  handleUserClick(info: IListClickInfo) {
    const userAnswer = info.event.target as HTMLElement;
    if (info.label === this.correctWordData.wordTranslate) {
      userAnswer.classList.add('correct-answer');
      this.userAnswersCount.correct += 1;
    } else {
      userAnswer.classList.add('wrong-answer');
      this.userAnswersCount.wrong += 1;
    }
  }

  showCorrectAnswer() {
    const correctAnswerImage = new BaseComponent(
      this.gameContainer.node,
      'div',
      'audio-game__answer-image'
    ).node;
    const correctAnswerTranscription = new BaseComponent(
      this.gameContainer.node,
      'span',
      'audio-game__answer-image-name'
    ).node;
    correctAnswerTranscription.innerHTML = `${this.correctWordData.word} ${this.correctWordData.transcription}`;
    const nextButton = document.querySelector('.audio-game__button');
    nextButton.innerHTML = BUTTON_TEXT.next;
  }

  createTitle(name: string, titleName: string, className: string) {
    const title = new BaseComponent(
      this.gameContainer.node,
      titleName,
      className
    ).node;
    title.innerHTML = name;
  }

  createDescription(text: string) {
    const description = new BaseComponent(
      this.gameContainer.node,
      'p',
      'audio-game__description'
    ).node;
    description.innerHTML = text;
  }

  createLevelText(text: string) {
    const levelText = new BaseComponent(
      this.gameContainer.node,
      'span',
      'audio-game__choice'
    ).node;
    levelText.innerHTML = text;
  }
}

export default GameWindow;
