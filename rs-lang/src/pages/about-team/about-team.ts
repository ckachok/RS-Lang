import BaseComponent from 'common-components/base-component';
import Page from 'pages/page';
import Developer from 'pages/about-team/components/developer/developer';
import PAGE_INFO from 'pages/_constants';
import DEVELOPERS_DATA from 'pages/about-team/components/developer/_constants';
import 'pages/about-team/about-team.scss';

class AboutTeamPage extends Page {
  constructor(parentNode: HTMLElement, id: string) {
    super(parentNode, id);
  }

  private createDevelopers(parentNode: HTMLElement) {
    DEVELOPERS_DATA.forEach(devData => {
      const developer = new Developer(parentNode, 'div', 'developer', devData);
    });
  }

  protected createMain() {
    this.main = new BaseComponent(this.parentNode, 'main', 'main');
    const mainContainer = new BaseComponent(this.main.node, 'div', 'container main__container about-team__container').node;
    const pageTitle = new BaseComponent(mainContainer, 'h2', 'about-team__title', PAGE_INFO.aboutTeam.name);
    this.createDevelopers(mainContainer);
  }
}

export default AboutTeamPage;
