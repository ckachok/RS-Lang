import BaseComponent from 'common-components/base-component';
import Page from 'pages/page';
import AppFeature from 'pages/home/components/app-feature/app-feature';
import FEATURES from 'pages/home/components/app-feature/_constants';
import 'pages/home/home.scss';

class HomePage extends Page {
  constructor(parentNode: HTMLElement, id: string) {
    super(parentNode, id);
  }

  private createAppFeatures(parentNode: HTMLElement): void {
    FEATURES.forEach(item => {
      const feature = new AppFeature(parentNode, 'div', 'feature', item);
    });
  }

  private createDecorativeCircles(parentNode: HTMLElement): void {
    const decorativeSmallCircle = new BaseComponent(parentNode, 'div', 'decorative-circle decorative-circle_small');
    const decorativeBigCircle = new BaseComponent(parentNode, 'div', 'decorative-circle decorative-circle_big');
  }

  protected createMain(): void {
    this.main = new BaseComponent(this.parentNode, 'main', 'main');
    const mainContainer = new BaseComponent(this.main.node, 'div', 'container main__container home-container').node;
    this.createAppFeatures(mainContainer);
    this.createDecorativeCircles(mainContainer);
  }
}

export default HomePage;
