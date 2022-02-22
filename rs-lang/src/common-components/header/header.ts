import BaseComponent from 'common-components/base-component';
import Logo from 'common-components/logo-app/logo-app';
import DE_AUTH_BTN from 'common-components/header/_constants';
import PAGE_INFO from 'pages/_constants';
import { deleteUserData } from 'services/storage';
import { IPageData } from 'types/interfaces';
import { makeActive, makeInactive } from 'utils/secondary-functions';
import 'common-components/header/header.scss';

class Header extends BaseComponent {
  public menu: HTMLElement;
  public burgerMenu: HTMLElement;
  private authBtn: HTMLElement;
  private deAuthBtn: HTMLElement;
  private welcome: HTMLElement;
  public onBurgerMenu: () => void;
  public onAuthButton: () => void;

  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.createHeader();
  }

  private createUserWelcome(parentNode: HTMLElement, userName: string): void {
    this.welcome = new BaseComponent(parentNode, 'span', 'user__welcome').node;

    if (userName) {
      this.welcome.innerHTML = `Привет, ${userName}!`;
      makeActive(this.welcome);
    }
  }

  private createUserButtons(parentNode: HTMLElement): void {
    const buttonsContainer = new BaseComponent(parentNode, 'div', 'user__buttons-container').node;
    this.authBtn = new BaseComponent(buttonsContainer, 'button', 'user__authorization-btn').node;
    this.deAuthBtn = new BaseComponent(buttonsContainer, 'button', 'user__deauthorization-btn', DE_AUTH_BTN.NAME).node;
  }

  private handleAuthBtnClick(userName: string): void {
    this.authBtn.addEventListener('click', () => {
      if (userName) {
        makeActive(this.deAuthBtn);
        setTimeout(() => {
          makeInactive(this.deAuthBtn);
        }, DE_AUTH_BTN.TIME_HIDE);
        return;
      }

      this.onAuthButton();
    });
  }

  private handleDeAuthBtnClick(): void {
    this.deAuthBtn.addEventListener('click', () => {
      deleteUserData();
      window.location.hash = window.location.hash === PAGE_INFO.home.hash ? '#' : PAGE_INFO.home.hash;
    });
  }

  private createUser(parentNode: HTMLElement, userName: string): void {
    const user = new BaseComponent(parentNode, 'div', 'user').node;
    this.createUserWelcome(user, userName);
    this.createUserButtons(user);
    this.handleAuthBtnClick(userName);
    this.handleDeAuthBtnClick();
  }

  private showHideMenu(): void {
    if (this.burgerMenu.classList.contains('active')) {
      makeInactive(this.burgerMenu, this.menu);
    } else {
      makeActive(this.burgerMenu, this.menu);
    }
  }

  private handleBurgerMenuClick(): void {
    this.burgerMenu.addEventListener('click', () => {
      this.showHideMenu();
      this.onBurgerMenu();
    });
  }

  private createBurgerMenu(parentNode: HTMLElement): void {
    this.burgerMenu = new BaseComponent(parentNode, 'button', 'burger-menu').node;
    const burgerMenuLines = new BaseComponent(this.burgerMenu, 'span', 'burger-menu__lines');
    this.handleBurgerMenuClick();
  }

  private highlightActiveMenuLink(menuLink: HTMLAnchorElement, menuItemData: IPageData): void {
    const currPageHash = window.location.hash;

    if (currPageHash === menuLink.hash) {
      makeActive(menuLink);
    } else if (!currPageHash && menuItemData.name === PAGE_INFO.home.name) {
      makeActive(menuLink);
    }
  }

  private createMenuList(parentNode: HTMLElement, userName: string): void {
    const menuList = new BaseComponent(parentNode, 'ul', 'menu__list').node;
    const menuData = Object.values(PAGE_INFO);
    menuData.forEach(menuItemData => {
      const menuItem = new BaseComponent(menuList, 'li', 'menu__item').node;
      const menuLink = new BaseComponent<HTMLAnchorElement>(menuItem, 'a', 'menu__link', menuItemData.name).node;
      menuLink.href = menuItemData.hash;

      if (userName && menuItemData.name === PAGE_INFO.statistics.name) {
        makeActive(menuItem);
      }

      this.highlightActiveMenuLink(menuLink, menuItemData);
    });
  }

  private createMenu(parentNode: HTMLElement, userName: string): void {
    this.menu = new BaseComponent(parentNode, 'nav', 'menu').node;
    this.createMenuList(this.menu, userName);
  }

  private createHeader(): void {
    const userName = localStorage.getItem('userName');
    const headerContainer = new BaseComponent(this.node, 'div', 'container header__container').node;
    const logo = new Logo(headerContainer, 'a', 'logo-app');
    this.createUser(headerContainer, userName);
    this.createBurgerMenu(headerContainer);
    this.createMenu(headerContainer, userName);
  }
}

export default Header;
