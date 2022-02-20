import BaseComponent from 'common-components/base-component';
import Page from 'pages/page';
import TextbookMenu from './menu/menu';
import TextbookCard from './card/card';
import 'pages/textbook/textbook.scss';

const obj = {
  countCorrect: 0,
  countWrong: 0,
  word: 'string',
  translaiton: 'string',
  transcriptiin: 'string',
  definition: 'string',
  definitionTranslation: 'string',
  example: 'string',
  exampleTranslation: 'string'
};

class TextbookPage extends Page {
  private textbookMenu: TextbookMenu;
  private textbookCard: TextbookCard;
  constructor(parentNode: HTMLElement, id: string) {
    super(parentNode, id);
  }

  private createTextbookPagesControls(parentNode: HTMLElement): void {
    const pagesControls = new BaseComponent(parentNode, 'div', 'textbook__pages-controls').node;
    const prevPage = new BaseComponent(pagesControls, 'div', 'textbook__prev-page');
    const nextPage = new BaseComponent(pagesControls, 'div', 'textbook__next-page');
  }

  private createCardsWrapper(parentNode: HTMLElement): void {
    const cardWrapper = new BaseComponent(parentNode, 'div', 'textbook__words').node;
    this.creatCard(cardWrapper);
    this.creatCard(cardWrapper);
    this.creatCard(cardWrapper);
    this.creatCard(cardWrapper);
    this.creatCard(cardWrapper);
    this.creatCard(cardWrapper);
  }

  private creatCard(node: HTMLElement) {
    const card = new TextbookCard(node, 'div', 'word-card', obj);
  }

  protected createMain(): void {
    const main = new BaseComponent(this.parentNode, 'main', 'main');
    const mainContainer = new BaseComponent(main.node, 'div', 'container main__container home-container').node;
    this.textbookMenu = new TextbookMenu(mainContainer, 'div', 'textbook__menu');
    this.createTextbookPagesControls(mainContainer);
    this.createCardsWrapper(mainContainer);
  }
}

export default TextbookPage;
