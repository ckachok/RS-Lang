import BaseComponent from 'common-components/base-component';
import 'pages/home/components/app-feature/app-feature.scss';

class AppFeature extends BaseComponent {
  constructor(parentNode: HTMLElement, tagName: string, className: string, feature: { name: string, desc: string }) {
    super(parentNode, tagName, className);
    this.createFeatureApp(feature);
  }

  private createFeatureApp(feature: { name: string, desc: string }): void {
    const featureNameContainer = new BaseComponent(this.node, 'div', 'feature__name').node;
    const featureNameText = new BaseComponent(featureNameContainer, 'span', 'feature__name-text', feature.name);
    const featureDesc = new BaseComponent(this.node, 'div', 'feature__desc').node;
    const featureDescText = new BaseComponent(featureDesc, 'span', 'feature__desc-text', feature.desc);
  }
}

export default AppFeature;
