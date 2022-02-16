import BaseComponent from '../../../common-components/base-component';

class Button {
  public parentNode: HTMLElement;
  public text: string;

  constructor(parentNode: HTMLElement, text: string) {
    this.parentNode = parentNode;
    this.text = text;
    this.createButton();
  }

  createButton() {
    const button = new BaseComponent(this.parentNode, 'button', 'audio-game__start').node;
    button.innerHTML = this.text;
  }
}

export default Button;
