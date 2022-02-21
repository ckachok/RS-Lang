import BaseComponent from 'common-components/base-component';
import { IVariantInfo } from 'types/interfaces';

class List {
  private listContainer: BaseComponent<HTMLElement>;
  public parentNode: HTMLElement;
  public amount: number;
  public callback: (info: IVariantInfo) => void;
  public elements: Array<string>;
  public itemsArray: Array<HTMLElement>;

  constructor(parentNode: HTMLElement, elements: Array<string>, callback: (info: IVariantInfo) => void) {
    this.parentNode = parentNode;
    this.elements = elements;
    this.amount = elements.length;
    this.callback = callback;
  }

  createListItem(className: string) {
    const listItem = new BaseComponent(this.listContainer.node, 'li', className).node;
    return listItem;
  }

  onItemClick(mouseEvent: MouseEvent) {
    const target = mouseEvent.target as HTMLElement;

    if (!(target.closest('li'))) return;

    const itemIndex = this.itemsArray.indexOf(target);
    const element = this.elements[itemIndex];

    const info: IVariantInfo = {
      index: itemIndex,
      label: element,
      target: mouseEvent.target as HTMLElement
    };

    if (this.callback !== null) {
      this.callback(info);
    }
  }

  createItems(amount: number, className: string) {
    this.itemsArray = [];

    for (let i = 0; i < amount; i++) {
      this.itemsArray.push(this.createListItem(className));
      this.itemsArray[i].innerHTML = this.elements[i];
    }

    this.listContainer.node.addEventListener('click', event => this.onItemClick(event));
  }

  createContainer(className: string, childName: string) {
    this.listContainer = new BaseComponent(this.parentNode, 'ul', className);
    this.createItems(this.amount, childName);
    return this.listContainer;
  }
}

export default List;
