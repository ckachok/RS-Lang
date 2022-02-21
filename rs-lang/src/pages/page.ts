import BaseComponent from 'common-components/base-component';
import Header from 'common-components/header/header';
import Footer from 'common-components/footer/footer';
import Cover from 'common-components/cover/cover';
import { makeActive, makeInactive } from 'utils/secondary-functions';
// import Authorization from 'common-components/authorization/authorization';
abstract class Page {
  protected parentNode: HTMLElement;
  protected header: Header;
  protected main: BaseComponent<HTMLElement>;
  protected footer: Footer;
  private cover: Cover;
  // private authorization: Authorization;

  constructor(parentNode: HTMLElement, id: string) {
    this.parentNode = parentNode;
    this.parentNode.id = id;
    this.header = new Header(this.parentNode, 'header', 'header');
    this.createMain();
    this.footer = new Footer(this.parentNode, 'footer', 'footer');
    this.cover = new Cover(this.parentNode, 'div', 'cover');
    // this.authorization = new Authorization(this.parentNode, 'div', 'authorization');
    this.startMenuInteractionCycle();
    this.startUserAuthorizationCycle();
    this.startCoverInteractionCycle();
  }

  private startUserAuthorizationCycle(): void {
    // this.header.onAuthButton = () => makeActive(this.authorization.node, this.cover.node);
  }

  private startMenuInteractionCycle(): void {
    this.header.onBurgerMenu = () => this.cover.node.classList.toggle('active');
  }

  private startCoverInteractionCycle(): void {
    // this.cover.onCover = () => makeInactive(this.header.menu, this.header.burgerMenu, this.authorization.node);
  }

  protected startPageRefreshCycle(): void {
    this.main.destroy();
    this.createMain();
  }

  protected createMain(): void {
    this.main = new BaseComponent(this.parentNode, 'main', 'main');
    const mainContainer = new BaseComponent(this.main.node, 'div', 'container main__container');
  }
}

export default Page;
