export interface IMenuData {
  [item: string]: {
    name: string;
    href: string;
  }
}

export interface IPageData {
  name: string;
  hash: string;
  id: string;
}

export interface IUserData {
  name: string;
  email: string;
  password: string;
}
