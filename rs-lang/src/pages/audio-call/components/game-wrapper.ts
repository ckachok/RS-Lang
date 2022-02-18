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
    this.userAnswersCount = { correct: [], wrong: [] };
    this.difficultyLevel = null;
  }

  createContainer() {
    this.gameContainer = new BaseComponent(this.node, 'div', 'audio-game');
    this.createTitle(
      this.gameContainer.node,
      'Аудиовызов',
      'h1',
      'audio-game__name'
    );
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
    this.createTitle(
      this.gameContainer.node,
      'Аудиовызов',
      'h4',
      'audio-game__level-name'
    );
    const soundButton = new Button(this.gameContainer.node);
    soundButton
      .createButton('', 'audio-game__sound-button')
      .addEventListener('click', () => this.onSoundButtonClick(this.correctWordData.audio));
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
    setTimeout(() => this.onSoundButtonClick(this.correctWordData.audio), 500);
  }

  showResults() {
    this.gameContainer.destroy();
    this.gameContainer = new BaseComponent(
      this.node,
      'div',
      'audio-game__results'
    );
    this.createTitle(
      this.gameContainer.node,
      'Аудиовызов',
      'h4',
      'audio-game__level-name'
    );
    const resultsContainer = new BaseComponent(
      this.gameContainer.node,
      'div',
      'audio-game__results-container'
    ).node;

    this.createTitle(
      resultsContainer,
      'Результаты',
      'h5',
      'audio-game__results-name'
    );

    this.createWrongResultsList(resultsContainer);
    this.createCorrectResultsList(resultsContainer);
  }

  createCorrectResultsList(resultsContainer: HTMLElement) {
    const correctAnswersArray: Array<string> = [];
    this.userAnswersCount.correct.forEach(item => {
      correctAnswersArray.push(item.meaning);
    });

    this.createTitle(
      resultsContainer,
      'Правильные ответы',
      'h6',
      'audio-game__results__correct-name'
    );

    const answersCount = new BaseComponent(resultsContainer, 'span', 'correct-answer__count').node;
    answersCount.innerText = String(correctAnswersArray.length);
    const correctResults = new List(
      resultsContainer,
      correctAnswersArray,
      info => this.onSoundButtonClick(this.userAnswersCount.correct[info.index].audio)
    );
    correctResults.createContainer('audio-game__results__correct', 'result-word');
  }

  createWrongResultsList(resultsContainer: HTMLElement) {
    this.createTitle(
      resultsContainer,
      'Heправильные ответы',
      'h6',
      'audio-game__results__wrong-name'
    );

    const wrongAnswersArray: Array<string> = [];
    this.userAnswersCount.wrong.forEach(item => {
      wrongAnswersArray.push(item.meaning);
    });

    const answersCount = new BaseComponent(resultsContainer, 'span', 'wrong-answer__count').node;
    answersCount.innerText = String(wrongAnswersArray.length);

    const wrongResults = new List(resultsContainer, wrongAnswersArray, info => this.onSoundButtonClick(
      this.userAnswersCount.wrong[info.index].audio
    ));
    wrongResults.createContainer('audio-game__results__wrong', 'result-word');
  }

  async actionButton(actionButton: HTMLElement) {
    if (this.levelIndex === 4) {
      this.showResults();
    } else if (actionButton.innerText === BUTTON_TEXT.skip) {
      this.showCorrectAnswer();
    } else {
      await this.generateWordsOptions(this.difficultyLevel);
      this.onStartButtonClick();
    }
  }

  onSoundButtonClick(url: string) {
    const sound = new AudioSound();
    sound.playSound(url);
  }

  onVariantClick(info: IListClickInfo): void {
    this.handleUserClick(info);
    this.showCorrectAnswer();
  }

  handleUserClick(info: IListClickInfo) {
    const userAnswer = info.event.target as HTMLElement;
    const answer = {
      meaning: `<strong>${this.correctWordData.word}</strong> - ${this.correctWordData.wordTranslate}`,
      audio: this.correctWordData.audio,
    };
    if (info.label === this.correctWordData.wordTranslate) {
      userAnswer.classList.add('correct-answer');
      this.userAnswersCount.correct.push(answer);
    } else {
      userAnswer.classList.add('wrong-answer');
      this.userAnswersCount.wrong.push(answer);
    }
  }

  showCorrectAnswer() {
    const correctAnswerImage = new BaseComponent(
      this.gameContainer.node,
      'div',
      'audio-game__answer-image'
    ).node;
    correctAnswerImage.style.backgroundImage = `url(https://react-learnwords-example.herokuapp.com/${this.correctWordData.image})`;
    this.createAnswerImageText();
    const nextButton = document.querySelector('.audio-game__button');
    nextButton.innerHTML = BUTTON_TEXT.next;
  }

  createAnswerImageText() {
    const correctAnswerText = new BaseComponent(
      this.gameContainer.node,
      'div',
      'audio-game__answer-image-text'
    ).node;
    const audiIcon = new BaseComponent(
      correctAnswerText,
      'span',
      'audio-game__audio-icon'
    ).node;
    audiIcon.addEventListener('click', () => this.onSoundButtonClick(this.correctWordData.audio));
    const correctAnswerTranscription = new BaseComponent(
      correctAnswerText,
      'span',
      'audio-game__answer-image-transcription'
    ).node;
    correctAnswerTranscription.innerHTML = `${this.correctWordData.word} ${this.correctWordData.transcription}`;
  }

  createTitle(
    block: HTMLElement,
    content: string,
    titleName: string,
    className: string
  ) {
    const title = new BaseComponent(block, titleName, className).node;
    title.innerHTML = content;
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
