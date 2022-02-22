import BaseComponent from 'common-components/base-component';
import { IWordData } from 'types/interfaces';
import 'pages/textbook/components/card/card.scss';
import ApiLearnWords, { BASE } from 'services/api';
import { makeActive, makeInactive } from 'utils/secondary-functions';

export const playback = new Audio();

class TextbookCard extends BaseComponent {
  countCorrect: number;
  countWrong: number;
  word: string;
  translaiton: string;
  transcriptiin: string;
  definition: string;
  definitionTranslation: string;
  example: string;
  exampleTranslation: string;
  playback: HTMLAudioElement;

  constructor(parentNode: HTMLElement, tagName: string, className: string, wordData: IWordData) {
    super(parentNode, tagName, className);
    // this.playback = new Audio();
    this.createCard(wordData);
  }

  handleCardSoundClick(cardSound: HTMLElement, wordData: IWordData) {
    cardSound.addEventListener('click', () => {
      if (playback) {
        playback.pause();
      }
      const playList = [wordData.audio, wordData.audioMeaning, wordData.audioExample];
      playback.src = `${BASE}/${playList[0]}`;
      playback.play();
      let current = 0;
      playback.addEventListener('ended', () => {
        current++;
        if (current >= playList.length) {
          playback.pause();
        }
        playback.src = `${BASE}/${playList[current]}`;
        playback.play();
      });
    });
  }

  private createCardImage(userName: string, wordData: IWordData) {
    const cardImage = new BaseComponent(this.node, 'div', 'word-card__image').node;
    cardImage.style.backgroundImage = `url(${BASE}/${wordData.image})`;
    const cardSound = new BaseComponent(cardImage, 'button', 'word-card__sound').node;
    this.handleCardSoundClick(cardSound, wordData);
    const cardAnswers = new BaseComponent(cardImage, 'div', 'word-card__answer-counters').node;
    const incorrectAnswer = new BaseComponent(cardAnswers, 'span', 'word-card__incorrect-answer', `${this.countCorrect || 0}`);
    const correctAnswer = new BaseComponent(cardAnswers, 'span', 'word-card__correct-answer', `${this.countWrong || 0}`);
    if (userName) {
      incorrectAnswer.node.classList.add('visibility');
      correctAnswer.node.classList.add('visibility');
    }
  }

  createWordControlBtns(userName: string, wordData: IWordData) {
    const compound = new BaseComponent(this.node, 'button', 'word-card__compound-word').node;
    const learned = new BaseComponent(this.node, 'button', 'word-card__learned-word').node;
    if (userName) {
      compound.classList.add('visibility');
      learned.classList.add('visibility');
    }
    compound.addEventListener('click', async () => {
      const userId = localStorage.getItem('userId');
      makeActive(compound);
      compound.parentElement.classList.add('hard');
      await new ApiLearnWords().saveUserWord(userId, wordData.id, { difficulty: 'hard', optional: {isLearned: false} });
   
    });
    learned.addEventListener('click', () => {
      makeActive(learned);
      makeInactive(compound);
      learned.parentElement.classList.add('learned');
      compound.style.pointerEvents = 'none';
    });
  }

  private createWord(wordData: IWordData) {
    const wordContainer = new BaseComponent(this.node, 'div', 'word-card__word-container').node;
    const word = new BaseComponent(wordContainer, 'div', 'word-card__word', `${wordData.word}`);
    const translation = new BaseComponent(wordContainer, 'div', 'word-card__translation', `${wordData.wordTranslate}`);
    const transcription = new BaseComponent(wordContainer, 'div', 'word-card__transcription', `${wordData.transcription}`);
  }

  private createDefinition(wordData: IWordData) {
    const defContainer = new BaseComponent(this.node, 'div', 'word-card__definition-container').node;
    const def = new BaseComponent(defContainer, 'div', 'word-card__text');
    def.node.innerHTML = wordData.textMeaning;
    const defTranslation = new BaseComponent(defContainer, 'div', 'word-card__text', `${wordData.textMeaningTranslate}`);
  }

  private createExample(wordData: IWordData) {
    const exampleContainer = new BaseComponent(this.node, 'div', 'word-card__example-container').node;
    const example = new BaseComponent(exampleContainer, 'div', 'word-card__text');
    example.node.innerHTML = wordData.textExample;
    const exampleTranslation = new BaseComponent(exampleContainer, 'div', 'word-card__text', `${wordData.textExampleTranslate}`);
  }

  private createCard(wordData: IWordData) {
    const userName = localStorage.getItem('userName');
    this.createCardImage(userName, wordData);
    this.createWordControlBtns(userName, wordData);
    this.createWord(wordData);
    this.createDefinition(wordData);
    this.createExample(wordData);
  }
}

export default TextbookCard;
