import { DIFFICULTY_LEVELS, BUTTON_TEXT } from 'pages/audio-call/_constants';
import BaseComponent from '../../../common-components/base-component';

class List {
  private listContainer: BaseComponent<HTMLElement>;
  public parentNode: HTMLElement;
  public amount: number;

  constructor(parentNode: HTMLElement, amount: number) {
    this.parentNode = parentNode;
    this.amount = amount;
  }

  createContainer(className: string, childName: string) {
    this.listContainer = new BaseComponent(this.parentNode, 'ul', className);
    this.createItems(this.amount, childName);
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
    const itemsArray = [];
    for (let i = 1; i <= amount; i++) {
      itemsArray.push(this.createListItem(className));
    }

    if (className === 'level-option') {
      this.addTextToItems(itemsArray, ['завтрак', 'вино', 'наслаждаться', 'путешествовать', 'лодка']);
      this.chooseOption(itemsArray);
    } else {
      this.addTextToItems(itemsArray, DIFFICULTY_LEVELS);
      this.chooseLevel(itemsArray);
    }
  }

  addTextToItems(itemsArray: Array<HTMLElement>, textArray: Array<string>) {
    for (let i = 0; i < textArray.length; i++) {
      itemsArray[i].innerHTML = textArray[i];
    }
  }

  chooseLevel(itemsArray: Array<HTMLElement>) {
    this.listContainer.node.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      if (!(target.closest('li'))) return;
      const targetNum = +target.innerHTML - 1;
      const choosenLevel = itemsArray.splice(targetNum, 1);
      itemsArray.forEach(item => {
        item.classList.add('invisible');
      });
    });
  }

  chooseOption(itemsArray: Array<HTMLElement>) {
    this.listContainer.node.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      if (!(target.closest('li'))) return;
      const userAnswer = target.innerHTML;
      console.log(userAnswer);
    });
  }
}

export default List;
