import BaseComponent from 'common-components/base-component';
import DEVELOPERS_DATA from 'pages/about-team/components/developer/_constants';
import { GITHUB_HREF } from 'common-components/footer/_constants';
import { IDeveloperData } from 'types/interfaces';
import 'pages/about-team/components/developer/developer.scss';

class Developer extends BaseComponent {
  private devInfo: HTMLElement;

  constructor(parentNode: HTMLElement, tagName: string, className: string, devData: IDeveloperData) {
    super(parentNode, tagName, className);
    this.createDeveloper(devData);
  }

  private createDevName(devData: IDeveloperData) {
    const devName = new BaseComponent<HTMLAnchorElement>(this.devInfo, 'a', 'developer__name', devData.name);
    devName.node.href = GITHUB_HREF + devData.githubName;
    devName.node.target = '_blank';
  }

  private createDevContribution(devData: IDeveloperData) {
    const devContribution = new BaseComponent(this.devInfo, 'p', 'developer__contribution');
    devContribution.node.innerHTML = devData.contribution;
  }

  private createDeveloperInfo(devData: IDeveloperData) {
    this.devInfo = new BaseComponent(this.node, 'div', 'developer__info').node;
    this.createDevName(devData);
    const devRole = new BaseComponent(this.devInfo, 'p', 'developer__role', devData.role);
    this.createDevContribution(devData);
  }

  private createDeveloper(devData: IDeveloperData) {
    this.createDeveloperInfo(devData);
    const developerPhoto = new BaseComponent(this.node, 'div', 'developer__photo').node;

    if (devData.name === DEVELOPERS_DATA[1].name) { //! поменять местами описание и фото
      this.node.insertBefore(developerPhoto, this.devInfo);
    }
  }
}

export default Developer;
