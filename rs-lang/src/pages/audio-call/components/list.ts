import LevelData from 'pages/audio-call/components/level-data';
import BaseComponent from 'common-components/base-component';
import { IListClickInfo } from 'types/interfaces';

class List {
  private listContainer: BaseComponent<HTMLElement>;
  public parentNode: HTMLElement;
  public amount: number;
  public callback: (info: IListClickInfo) => void;
  public elements: Array<string>;
  public itemsArray: Array<HTMLElement>;

  constructor(parentNode: HTMLElement, elements: Array<string>, callback: (info: IListClickInfo) => void) {
    this.parentNode = parentNode;
    this.elements = elements;
    this.amount = elements.length;
    this.callback = callback;
  }

  createContainer(className: string, childName: string) {
    this.listContainer = new BaseComponent(this.parentNode, 'ul', className);
    this.createItems(this.amount, childName);
    return this.listContainer;
  }

  createListItem(className: string) {
    const listItem = new BaseComponent(
      this.listContainer.node,
      'li',
      className
    ).node;
    return listItem;
  }

  createItems(amount: number, className: string) {
    this.itemsArray = [];

    for (let i = 0; i < amount; i++) {
      this.itemsArray.push(this.createListItem(className));
      this.itemsArray[i].innerHTML = this.elements[i];
    }

    this.listContainer.node.addEventListener('click', event => this.onItemClick(event));
  }

  onItemClick(mouseEvent: MouseEvent) {
    const target = mouseEvent.target as HTMLElement;
    if (!(target.closest('li'))) return;

    const itemIndex = this.itemsArray.indexOf(target);
    const element = this.elements[itemIndex];

    const info: IListClickInfo = {
      index: itemIndex,
      label: element,
      event: mouseEvent
    };
    if (this.callback !== null) {
      this.callback(info);
    }
  }
}

export default List;
