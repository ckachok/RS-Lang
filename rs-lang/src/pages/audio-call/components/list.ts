import BaseComponent from '../../../common-components/base-component';

class List {
  private listContainer: BaseComponent<HTMLElement>;
  public parentNode: HTMLElement;
  public amount: number;

  constructor(parentNode: HTMLElement, amount: number) {
    this.parentNode = parentNode;
    this.amount = amount;
    this.createContainer();
  }

  createContainer() {
    this.listContainer = new BaseComponent(
      this.parentNode,
      'ul',
      'audio-game__level-choice'
    );
    this.createItems(this.amount);
  }

  createListItem() {
    const listItem = new BaseComponent(
      this.listContainer.node,
      'li',
      'audio-game__level-button'
    ).node;
    return listItem;
  }

  createItems(amount: number) {
    const itemsArray = [];
    for (let i = 1; i <= amount; i++) {
      itemsArray.push(this.createListItem());
    }
    this.addTextToItems(itemsArray, ['1', '2', '3', '4', '5', '6']);
  }

  addTextToItems(itemsArray: Array<HTMLElement>, textArray: Array<string>) {
    for (let i = 0; i < textArray.length; i++) {
      itemsArray[i].innerHTML = textArray[i];
    }
  }
}

export default List;
