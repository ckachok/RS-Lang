import List from 'pages/audio-call/components/list';
import BaseComponent from 'common-components/base-component';
import { DIFFICULTY_LEVELS, BUTTON_TEXT } from 'pages/audio-call/_constants';
import { IVariantInfo, IUserAnswersCount, IWordData } from 'types/interfaces';
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
  gameStarted: boolean;

  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.levelWords = new LevelData();
    this.createContainer();
    this.levelIndex = 0;
    this.correctWordData = null;
    this.userAnswersCount = { correct: [], wrong: [] };
    this.difficultyLevel = null;
    this.gameStarted = false;
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
      if (this.gameStarted === false) {
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
      } else {
        switch (event1.code) {
          case 'Digit1': this.onVariantClick(this.getVariantInfo(0));
            break;
          case 'Digit2': this.onVariantClick(this.getVariantInfo(1));
            break;
          case 'Digit3': this.onVariantClick(this.getVariantInfo(2));
            break;
          case 'Digit4': this.onVariantClick(this.getVariantInfo(3));
            break;
          case 'Digit5': this.onVariantClick(this.getVariantInfo(4));
            break;
        }
      }

      if (event1.code === 'Space') {
        this.onSoundButtonClick(this.correctWordData.audio);
      }

      const gameButton = document.querySelector('.audio-game__button') as HTMLElement;

      if (event1.code === 'Enter' && this.correctWordData !== null && this.gameStarted === true) {
        this.onActionButtonClick(gameButton);
      }

      if (event1.code === 'Enter' && this.difficultyLevel !== null && this.gameStarted === false) {
        this.onStartButtonClick();
      }
    });
  }

  createDescription(text: string) {
    const description = new BaseComponent(this.gameContainer.node, 'p', 'audio-game__description').node;
    description.innerHTML = text;
  }

  async onLevelClick(info: IVariantInfo) {
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

  handleUserClick(info: IVariantInfo) {
    const userAnswer = info.target as HTMLElement;
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

  createAnswerImageText() {
    const correctAnswerText = new BaseComponent(this.gameContainer.node, 'div', 'audio-game__answer-image-text').node;

    const audiIcon = new BaseComponent(correctAnswerText, 'span', 'audio-game__audio-icon').node;
    audiIcon.addEventListener('click', () => this.onSoundButtonClick(this.correctWordData.audio));

    const correctAnswerTranscription = new BaseComponent(correctAnswerText, 'span', 'audio-game__answer-image-transcription').node;
    correctAnswerTranscription.innerHTML = `${this.correctWordData.word} ${this.correctWordData.transcription}`;
  }

  showCorrectAnswer() {
    const correctAnswerImage = new BaseComponent(this.gameContainer.node, 'div', 'audio-game__answer-image').node;
    correctAnswerImage.style.backgroundImage = `url(https://react-learnwords-example.herokuapp.com/${this.correctWordData.image})`;

    this.createAnswerImageText();

    const nextButton = document.querySelector('.audio-game__button');
    nextButton.innerHTML = BUTTON_TEXT.next;
  }

  onVariantClick(info: IVariantInfo): void {
    this.handleUserClick(info);
    this.showCorrectAnswer();
  }

  onSkipButtonClick() {
    const answer = {
      meaning: `<strong>${this.correctWordData.word}</strong> - ${this.correctWordData.wordTranslate}`,
      audio: this.correctWordData.audio,
    };

    const optionsArray = Array.from(document.querySelectorAll('.level-option'));
    optionsArray.forEach(option => {
      if (option.innerHTML === this.correctWordData.wordTranslate) {
        option.classList.add('correct-answer');
      }
    });

    this.userAnswersCount.wrong.push(answer);
    this.showCorrectAnswer();
  }

  createWrongResultsList(resultsContainer: HTMLElement) {
    this.createTitle(resultsContainer, 'Heправильные ответы', 'h6', 'audio-game__results__wrong-name');

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

  createTitle(block: HTMLElement, content: string, titleName: string, className: string) {
    const title = new BaseComponent(block, titleName, className).node;
    title.innerHTML = content;
  }

  createCorrectResultsList(resultsContainer: HTMLElement) {
    const correctAnswersArray: Array<string> = [];
    this.userAnswersCount.correct.forEach(item => {
      correctAnswersArray.push(item.meaning);
    });

    this.createTitle(resultsContainer, 'Правильные ответы', 'h6', 'audio-game__results__correct-name');

    const answersCount = new BaseComponent(resultsContainer, 'span', 'correct-answer__count').node;
    answersCount.innerText = String(correctAnswersArray.length);

    const correctResults = new List(
      resultsContainer,
      correctAnswersArray,
      info => this.onSoundButtonClick(this.userAnswersCount.correct[info.index].audio)
    );
    correctResults.createContainer('audio-game__results__correct', 'result-word');
  }

  onPlayAgainButtonClick() {
    this.gameContainer.destroy();
    this.levelIndex = 0;
    this.correctWordData = null;
    this.userAnswersCount = { correct: [], wrong: [] };
    this.difficultyLevel = null;
    this.gameStarted = false;
    this.createContainer();
  }

  showResults() {
    this.gameContainer.destroy();
    this.gameContainer = new BaseComponent(this.node, 'div', 'audio-game__results');

    this.createTitle(this.gameContainer.node, 'Аудиовызов', 'h4', 'audio-game__level-name');

    const resultsContainer = new BaseComponent(this.gameContainer.node, 'div', 'audio-game__results-container').node;

    this.createTitle(resultsContainer, 'Результаты', 'h5', 'audio-game__results-name');

    this.createWrongResultsList(resultsContainer);
    this.createCorrectResultsList(resultsContainer);

    const playAgainButton = new BaseComponent(resultsContainer, 'button', 'audio-game__button', BUTTON_TEXT.again).node;
    playAgainButton.addEventListener('click', () => this.onPlayAgainButtonClick());

    const textBookButton = new BaseComponent(resultsContainer, 'button', 'audio-game__button', BUTTON_TEXT.toTextbook).node;
    textBookButton.addEventListener('click', () => {
      window.location.href = '#textbook';
    });
  }

  async generateWordsOptions(targetNum: number) {
    this.wordsData = await this.levelWords.getWordsData(targetNum);
    this.correctWordData = this.wordsData[this.levelIndex];

    const wordsArray = [];
    wordsArray.push(this.correctWordData.wordTranslate);
    this.answers = this.levelWords.generateAnswers(this.wordsData, wordsArray);

    this.levelIndex += 1;
  }

  async onActionButtonClick(actionButton: HTMLElement) {
    if (actionButton.innerHTML === BUTTON_TEXT.skip) {
      this.onSkipButtonClick();
    } else {
      // eslint-disable-next-line no-lonely-if
      if (this.levelIndex === 3) {
        this.showResults();
      } else {
        await this.generateWordsOptions(this.difficultyLevel);
        this.onStartButtonClick();
      }
    }
  }

  onSoundButtonClick(url: string) {
    const audioObject = new Audio(`https://react-learnwords-example.herokuapp.com/${url}`);
    audioObject.play();
  }

  onStartButtonClick() {
    this.gameContainer.destroy();
    this.gameContainer = new BaseComponent(this.node, 'div', 'audio-game__level');

    this.createTitle(this.gameContainer.node, 'Аудиовызов', 'h4', 'audio-game__level-name');

    const soundButton = new BaseComponent(this.gameContainer.node, 'button', 'audio-game__sound-button').node;
    soundButton.addEventListener('click', () => this.onSoundButtonClick(this.correctWordData.audio));

    const levelOptions = new List(this.gameContainer.node, this.answers.sort(), info => this.onVariantClick(info));
    levelOptions.createContainer('audio-game__level-options', 'level-option');

    const actionButton = new BaseComponent(this.gameContainer.node, 'button', 'audio-game__button', BUTTON_TEXT.skip).node;
    actionButton.addEventListener('click', () => this.onActionButtonClick(actionButton));

    this.gameStarted = true;

    setTimeout(() => this.onSoundButtonClick(this.correctWordData.audio), 100);
  }

  createContainer() {
    this.gameContainer = new BaseComponent(this.node, 'div', 'audio-game');

    this.addHotKeys();

    this.createTitle(this.gameContainer.node, 'Аудиовызов', 'h1', 'audio-game__name');
    this.createDescription('Данная игра поможет улучшить ваше восприятие речи на слух');

    const levelText = new BaseComponent(this.gameContainer.node, 'span', 'audio-game__choice').node;
    levelText.innerHTML = 'Выберите уровень сложности';

    this.levelsList = new List(this.gameContainer.node, DIFFICULTY_LEVELS, level => this.onLevelClick(level));
    this.levelsList.createContainer('audio-game__level-choice', 'audio-game__level-button');

    const startButton = new BaseComponent(this.gameContainer.node, 'button', 'audio-game__start', BUTTON_TEXT.start).node;
    startButton.addEventListener('click', () => {
      if (this.difficultyLevel === null) return;
      this.onStartButtonClick();
    });
  }
}

export default GameWindow;
