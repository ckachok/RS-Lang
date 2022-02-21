import BaseComponent from 'common-components/base-component';
import Page from 'pages/page';
import { CARD__CONTENT } from './_constants';
import 'pages/statistics/statistics.scss';
import { makeActive, makeInactive } from 'utils/secondary-functions';

class StatisticsPage extends Page {
  shortStatsWrapper: BaseComponent<HTMLElement>;
  toggleNav: boolean;
  constructor(parentNode: HTMLElement, id: string) {
    super(parentNode, id);
    this.toggleNav = false;
  }

  createTitle(node: HTMLElement) {
    const title = new BaseComponent(node, 'div', 'statistics__title', 'Статистика');
  }

  createNav(node: HTMLElement) {
    const navWrapper = new BaseComponent(node, 'div', 'statistics__nav').node;
    const navShortInfo = new BaseComponent(navWrapper, 'div', 'statistics__nav-link active', 'Краткосрочная');
    const navLongInfo = new BaseComponent(navWrapper, 'div', 'statistics__nav-link', 'Долгосрочная');
    navLongInfo.node.addEventListener('click', () => {
      if (!this.toggleNav) {
        this.shortStatsWrapper.destroy();
        this.createSubtitle(node, 'Ошибка, недостаточно данных для графиков');
        makeActive(navLongInfo.node);
        makeInactive(navShortInfo.node);
        this.toggleNav = true;
      }
    });
    navShortInfo.node.addEventListener('click', () => {
      this.startPageRefreshCycle();
      if (this.toggleNav) {
        makeActive(navShortInfo.node);
        makeInactive(navLongInfo.node);
        this.toggleNav = false;
      }
    });
  }

  createSubtitle(node: HTMLElement, text: string) {
    const subtitle = new BaseComponent(node, 'div', 'statistics__subtitle', `${text}`);
  }

  createCard(node: HTMLElement, name: string) {
    const cardWrapper = new BaseComponent(node, 'div', 'statistics__item').node;
    const cardName = new BaseComponent(cardWrapper, 'div', 'statistics__name', `${name}`);
    CARD__CONTENT.forEach(cardContent => {
      const itemPoint = new BaseComponent(cardWrapper, 'div', 'statistics__item-point').node;
      const icon = new BaseComponent(itemPoint, 'div', 'statistics__item-icon');
      const text = new BaseComponent(itemPoint, 'div', 'statistics__item-text', `${cardContent}`);
    });
  }

  createaStatGame(node: HTMLElement) {
    const statGameWrapper = new BaseComponent(node, 'div', 'statistics__by-game').node;
    this.createCard(statGameWrapper, 'Аудиовызов');
    this.createCard(statGameWrapper, 'Спринт');
  }

  createStatWords(node: HTMLElement) {
    const statGameWrapper = new BaseComponent(node, 'div', 'statistics__by-words').node;
    this.createCard(statGameWrapper, '');
  }

  createShortStats(node: HTMLElement) {
    this.shortStatsWrapper = new BaseComponent(node, 'div', 'scroll');
    this.createSubtitle(this.shortStatsWrapper.node, 'По мини-играм за день');
    this.createaStatGame(this.shortStatsWrapper.node);
    this.createSubtitle(this.shortStatsWrapper.node, 'По словам за день');
    this.createStatWords(this.shortStatsWrapper.node);
  }

  protected createMain(): void {
    this.main = new BaseComponent(this.parentNode, 'main', 'main');
    const mainContainer = new BaseComponent(this.main.node, 'div', 'container main__container home-container').node;
    this.createTitle(mainContainer);
    this.createNav(mainContainer);
    this.createShortStats(mainContainer);
    this.header.node.after(this.main.node);
  }
}

export default StatisticsPage;
