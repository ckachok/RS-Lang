import BaseComponent from 'common-components/base-component';
import Page from 'pages/page';
import TextbookMenu from 'pages/textbook/components/menu/menu';
import TextbookCard, { playback } from '../textbook/components/card/card';
import 'pages/textbook/textbook.scss';
import ApiLearnWords from 'services/api';
import { getTextbookStore } from 'services/storage';
import { IAggregatedWordData, IWordData } from 'types/interfaces';

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

  handleNextPageClick(nextPage: HTMLElement) {
    nextPage.addEventListener('click', () => {
      const storeTextbook = getTextbookStore();
      if (storeTextbook.curPageNumber === 30) { storeTextbook.curPageNumber = 0 };
      this.textbookMenu.currPageNumber.innerHTML = (storeTextbook.curPageNumber++).toString();
      localStorage.setItem('curPageNumber', (storeTextbook.curPageNumber++).toString());
      this.startPageRefreshCycle();
    });
  }

  handlePrevPageClick(prevPage: HTMLElement) {
    prevPage.addEventListener('click', () => {
      const storeTextbook = getTextbookStore();
      if (storeTextbook.curPageNumber === 1) {storeTextbook.curPageNumber = 31};
      this.textbookMenu.currPageNumber.innerHTML = (storeTextbook.curPageNumber--).toString();
      localStorage.setItem('curPageNumber', (storeTextbook.curPageNumber--).toString());
      this.startPageRefreshCycle();
    });
  }

  private createPageSwitches(parentNode: HTMLElement): void {
    const switchesContainer = new BaseComponent(parentNode, 'div', 'textbook__page-switches').node;
    const prevPage = new BaseComponent(switchesContainer, 'button', 'textbook__prev-page').node;
    const nextPage = new BaseComponent(switchesContainer, 'button', 'textbook__next-page').node;
    this.handleNextPageClick(nextPage);
    this.handlePrevPageClick(prevPage);
  }

  private async createCards(parentNode: HTMLElement) {
    const cardsContainer = new BaseComponent(parentNode, 'div', 'textbook__words-container').node;
    const storeTextbook = getTextbookStore();
    const data = {
      group: storeTextbook.curDifficultyLevel,
      page: storeTextbook.curPageNumber - 1
    }
    let words: IWordData[] | IAggregatedWordData[];
    const userId = localStorage.getItem('userId');
    if (data.group !== 6) {
      words = await new ApiLearnWords().getWords(data.group, data.page);
    } else {
      words = (await new ApiLearnWords().getAggregatedWords(userId, '{ "userWord.difficulty":"hard" }', '3600')).set;
    }
    // const words = await new ApiLearnWords().getWords(data.group, data.page);
    words.forEach(async wordData => {
      const card = new TextbookCard(cardsContainer, 'div', 'word-card', wordData);
    })
  }

  protected createMain(): void {
    this.main = new BaseComponent(this.parentNode, 'main', 'main');
    const mainContainer = new BaseComponent(this.main.node, 'div', 'container main__container home-container').node;
    this.textbookMenu = new TextbookMenu(mainContainer, 'div', 'textbook__menu');
    this.createPageSwitches(mainContainer);
    this.createCards(mainContainer);
    this.header.node.after(this.main.node);

    this.textbookMenu.onLevelItem = () => this.startPageRefreshCycle();
    playback.pause();
  }
}

export default TextbookPage;
