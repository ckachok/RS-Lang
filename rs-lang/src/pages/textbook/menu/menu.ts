import BaseComponent from '../../../common-components/base-component';
import './menu.scss';

class TextbookMenu extends BaseComponent {
  levelsNavList: string[];
  curentPage: number;
  allPages: number;
  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.levelsNavList = ['Уровень 1', 'Уровень 2', 'Уровень 3', 'Уровень 4', 'Уровень 5', 'Уровень 6', 'Сложные слова'];
    this.curentPage = 1;
    this.allPages = 30;
    this.createTextbookMenu();
  }

  private createLevelsNav() {
    const levelsNav = new BaseComponent(this.node, 'ul', 'levels-nav');
    this.levelsNavList.forEach(contentLi => {
      const li = new BaseComponent(levelsNav.node, 'li', 'levels-nav__link', `${contentLi}`);
    });
  }

  private createGamesNav() {
    const gamesNav = new BaseComponent(this.node, 'div', 'games-nav').node;
    const gamesNavIcon = new BaseComponent(gamesNav, 'div', 'games-nav__icon');
    const auduoCall = new BaseComponent(gamesNav, 'div', 'games-nav__link', 'Аудиовызов');
    const sprint = new BaseComponent(gamesNav, 'div', 'games-nav__link', 'Спринт');
  }

  private createPagesCounter() {
    const pagesCounter = new BaseComponent(this.node, 'div', 'pages-counter').node;
    const gamesNavIcon = new BaseComponent(pagesCounter, 'div', 'pages-counter__cur', `${this.curentPage}`);
    const auduoCall = new BaseComponent(pagesCounter, 'div', 'pages-counter__divider', '/');
    const sprint = new BaseComponent(pagesCounter, 'div', 'pages-counter__total', `${this.allPages}`);
  }

  private createTextbookMenu() {
    this.createLevelsNav();
    this.createGamesNav();
    this.createPagesCounter();
  }
}

export default TextbookMenu;