import { DIFFICULTY_LEVELS, BUTTON_TEXT } from 'pages/audio-call/_constants';
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
    this.addTextToItems(itemsArray, DIFFICULTY_LEVELS);
    this.chooseLevel(itemsArray);
  }

  addTextToItems(itemsArray: Array<HTMLElement>, textArray: Array<string>) {
    for (let i = 0; i < textArray.length; i++) {
      itemsArray[i].innerHTML = textArray[i];
    }
  }

  chooseLevel(itemsArray: Array<HTMLElement>) {
    this.listContainer.node.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      const targetNum = +target.innerHTML - 1;
      const choosenLevel = itemsArray.splice(targetNum, 1);
      itemsArray.forEach(item => {
        item.classList.add('invisible');
      });
    });
  }
}

export default List;
