import BaseComponent from 'common-components/base-component';
import { LEVEL_NAMES, TEXTBOOK_GAMES } from 'pages/textbook/components/menu/_constants';
import { getTextbookStore } from 'services/storage';
import { ITextbookStore } from 'types/interfaces';
import { makeActive, makeInactive } from 'utils/secondary-functions';
import 'pages/textbook/components/menu/menu.scss';
import { playback } from '../card/card';

class TextbookMenu extends BaseComponent {
  curLevelItem: HTMLElement; //! ключ доступа
  currPageNumber: HTMLElement; //! ключ доступа
  onLevelItem: () => void;

  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.createTextbookMenu();
  }

  private handleLevelItemClick(levelItem: HTMLElement, indexLevel: number): void {
    levelItem.addEventListener('click', () => {
      if (levelItem !== this.curLevelItem) {
        localStorage.setItem('curDifficultyLevel', indexLevel.toString());
        localStorage.removeItem('curPageNumber');
        makeInactive(this.curLevelItem);
        makeActive(levelItem);
        this.curLevelItem = levelItem;
        this.onLevelItem();
        // document.body.style.backgroundImage = `url(${aaa})`
        
      }
    });
  }

  private createLevelsNav(store: ITextbookStore): void {
    const userName = localStorage.getItem('userName');
    const levelsNav = new BaseComponent(this.node, 'ul', 'levels-nav');
    LEVEL_NAMES.forEach((name, index) => {
      const levelItem = new BaseComponent(levelsNav.node, 'li', 'levels-nav__item', name).node;
      if (index === store.curDifficultyLevel) {
        makeActive(levelItem);
        this.curLevelItem = levelItem;
      }

      if (!userName && index === LEVEL_NAMES.length - 1) {
        levelItem.classList.add('hidden');
      }

      if (LEVEL_NAMES.length - 1) {
        levelItem.addEventListener('click', () => {

        });
      }

      this.handleLevelItemClick(levelItem, index);
    });
  }

  private createGamesNav(): void {
    const gamesNav = new BaseComponent(this.node, 'div', 'games-nav').node;
    const gamesNavIcon = new BaseComponent(gamesNav, 'div', 'games-nav__icon');
    const gamesNavData = Object.values(TEXTBOOK_GAMES);
    gamesNavData.forEach(gameLinkData => {
      const gameLink = new BaseComponent<HTMLAnchorElement>(gamesNav, 'a', 'games-nav__link', gameLinkData.name).node;
      gameLink.href = gameLinkData.hash;
    });
  }

  private createPagesCounter(store: ITextbookStore): void {
    const counter = new BaseComponent(this.node, 'div', 'page-counter').node;
    this.currPageNumber = new BaseComponent(counter, 'div', 'page-counter__cur', `${store.curPageNumber}`).node;
    const divider = new BaseComponent(counter, 'div', 'page-counter__divider', '/').node;
    const totalPageCount = new BaseComponent(counter, 'div', 'page-counter__total', `${store.totalPageCount}`).node;
  }

  private handleHashChange(): void {
    window.addEventListener('hashchange', () => {
      localStorage.removeItem('curDifficultyLevel');
      localStorage.removeItem('curPageNumber');
    });
  }

  private createTextbookMenu(): void {
    const store = getTextbookStore();
    this.createLevelsNav(store);
    this.createGamesNav();
    this.createPagesCounter(store);
    this.handleHashChange();
  }
}

export default TextbookMenu;
