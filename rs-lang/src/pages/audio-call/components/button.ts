import BaseComponent from '../../../common-components/base-component';

class Button {
  public parentNode: HTMLElement;

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;
  }

  createButton(text: string, className: string) {
    const button = new BaseComponent(this.parentNode, 'button', className).node;
    button.innerHTML = text;
    return button;
  }
}

export default Button;
