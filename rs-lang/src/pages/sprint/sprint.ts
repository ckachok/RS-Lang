import BaseComponent from 'common-components/base-component';
import Page from 'pages/page';
import GameWindow from 'pages/sprint/components/game-window';
import 'pages/sprint/sprint.scss';

class SprintPage extends Page {
  constructor(parentNode: HTMLElement, id: string) {
    super(parentNode, id);
  }

  protected createMain(): void {
    const main = new BaseComponent(this.parentNode, 'main', 'main');
    const mainContainer = new BaseComponent(main.node, 'div', 'container main__container home-container').node;
    const game = new GameWindow(mainContainer, 'div', 'game__wrapper');
  }
}

export default SprintPage;
