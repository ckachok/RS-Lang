import BaseComponent from 'common-components/base-component';
import './card.scss';
import { ICard } from 'types/interfaces';

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
  constructor(parentNode: HTMLElement, tagName: string, className: string, cardInfo: ICard) {
    super(parentNode, tagName, className);
    this.countCorrect = cardInfo.countCorrect;
    this.countWrong = cardInfo.countWrong;
    this.word = cardInfo.word;
    this.translaiton = cardInfo.translaiton;
    this.transcriptiin = cardInfo.transcriptiin;
    this.definition = cardInfo.definition;
    this.definitionTranslation = cardInfo.definitionTranslation;
    this.example = cardInfo.example;
    this.exampleTranslation = cardInfo.exampleTranslation;
    this.createCard();
  }

  private creatCardImage(node: HTMLElement) {
    console.log(this.exampleTranslation);
    const img = new BaseComponent(node, 'div', 'word-card__image').node;
    const cardSong = new BaseComponent(img, 'div', 'word-card__sound');
    const cardAnswers = new BaseComponent(img, 'div', 'word-card__answer-counters').node;
    const wrongAnswer = new BaseComponent(cardAnswers, 'div', 'word-card__wrong-answer', `${this.countCorrect}`);
    const correctAnswer = new BaseComponent(cardAnswers, 'div', 'word-card__correct-answer', `${this.countWrong}`);
  }

  private createCardaTitle(node: HTMLElement) {
    const title = new BaseComponent(node, 'div', 'word-card__title').node;
    const compound = new BaseComponent(title, 'div', 'word-card__compound-word');
    const wordWrapper = new BaseComponent(title, 'div', 'word-card__word-container').node;
    const word = new BaseComponent(wordWrapper, 'div', 'word-card__word', `${this.word}`);
    const translation = new BaseComponent(wordWrapper, 'div', 'word-card__translation', `${this.translaiton}`);
    const transcription = new BaseComponent(wordWrapper, 'div', 'word-card__transcription', `${this.transcriptiin}`);
    const learned = new BaseComponent(title, 'div', 'word-card__learned-word');
  }

  private createDefinition(node: HTMLElement) {
    const defWrap = new BaseComponent(node, 'div', 'word-card__definition-container').node;
    const definition = new BaseComponent(defWrap, 'div', 'word-card__definition', `${this.definition}`);
    const definitionTranslation = new BaseComponent(defWrap, 'div', 'word-card__definition-translation', `${this.definitionTranslation}`);
  }

  private createExample(node: HTMLElement) {
    const exmpWrap = new BaseComponent(node, 'div', 'word-card__example-container').node;
    const example = new BaseComponent(exmpWrap, 'div', 'word-card__example', `${this.example}`);
    const exampleTranslation = new BaseComponent(exmpWrap, 'div', 'word-card__example-translation', `${this.exampleTranslation}`);
  }

  private createCard() {
    this.creatCardImage(this.node);
    this.createCardaTitle(this.node);
    this.createDefinition(this.node);
    this.createExample(this.node);
  }
}

export default TextbookCard;
