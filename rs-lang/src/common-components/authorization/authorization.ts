import BaseComponent from 'common-components/base-component';
import ApiLearnWords from 'services/api';
import PAGE_INFO from 'pages/_constants';
import {
  FIELD_DATA, REG_SUCCESSFUL_MESSAGE, SUBMIT_BUTTON_NAMES, SWITCH_BUTTONS_NAMES
} from 'common-components/authorization/_constants';
import { saveUserData } from 'services/storage';
import { IUserData } from 'types/interfaces';
import { makeActive, makeInactive } from 'utils/secondary-functions';
import 'common-components/authorization/authorization.scss';

class Authorization extends BaseComponent {
  private inputUserName: HTMLInputElement;
  private inputEmail: HTMLInputElement;
  private inputPassword: HTMLInputElement;
  private authSwitchButton: HTMLElement;
  private regSwitchButton: HTMLElement;
  private authSubmitButton: HTMLElement;
  private regSubmitButton: HTMLElement;
  private message: HTMLElement;

  constructor(parentNode: HTMLElement, tagName: string, className: string) {
    super(parentNode, tagName, className);
    this.createAuthorization();
  }

  private handleAuthSwitchBtnClick(): void {
    this.authSwitchButton.addEventListener('click', () => {
      makeActive(this.authSwitchButton, this.authSubmitButton);
      makeInactive(this.regSwitchButton, this.inputUserName.parentElement, this.regSubmitButton, this.message);
      this.inputUserName.required = false;
    });
  }

  private handleRegSwitchBtnClick(): void {
    this.regSwitchButton.addEventListener('click', () => {
      makeActive(this.regSwitchButton, this.inputUserName.parentElement, this.regSubmitButton);
      makeInactive(this.authSwitchButton, this.authSubmitButton, this.message);
      this.inputUserName.required = true;
    });
  }

  private createAuthorizationControls(): void {
    const controls = new BaseComponent(this.node, 'div', 'authorization__controls').node;
    this.authSwitchButton = new BaseComponent(controls, 'button', 'authorization__button active', SWITCH_BUTTONS_NAMES.authorization).node;
    this.regSwitchButton = new BaseComponent(controls, 'button', 'authorization__button', SWITCH_BUTTONS_NAMES.registration).node;
    this.handleAuthSwitchBtnClick();
    this.handleRegSwitchBtnClick();
  }

  private createFormField(parentNode: HTMLElement): void {
    [this.inputUserName, this.inputEmail, this.inputPassword] = FIELD_DATA.map(data => {
      const field = new BaseComponent(parentNode, 'div', 'authorization-form__field active').node;
      const fieldName = new BaseComponent(field, 'p', 'authorization-form__field-name', data.name);
      const fieldInput = new BaseComponent<HTMLInputElement>(field, 'input', 'authorization-form__field-input').node;
      fieldInput.type = data.type;
      fieldInput.pattern = data.pattern;
      fieldInput.title = data.title;
      fieldInput.required = data.required;
      return fieldInput;
    });
    makeInactive(this.inputUserName.parentElement);
  }

  private getFormFieldValues(): IUserData {
    const [name, email, password] = [this.inputUserName.value, this.inputEmail.value, this.inputPassword.value];
    return { name, email, password };
  }

  private isInputFieldsValid(): boolean {
    const isUserNameValid = this.inputUserName.validity.valid;
    const isEmailValid = this.inputEmail.validity.valid;
    const isPasswordValid = this.inputPassword.validity.valid;
    return isUserNameValid && isEmailValid && isPasswordValid;
  }

  private async performUserRegistration(): Promise<void> {
    const userData = this.getFormFieldValues();
    const userRegRequest = await new ApiLearnWords().registerNewUser(userData);
    this.message.innerHTML = userRegRequest.error ? userRegRequest.error : REG_SUCCESSFUL_MESSAGE;
    makeActive(this.message);
  }

  private handleRegSubmitBtnClick(): void {
    this.regSubmitButton.addEventListener('click', async event => {
      if (this.isInputFieldsValid()) {
        event.preventDefault();
        await this.performUserRegistration();
      }
    });
  }

  private async performUserAuthorization(): Promise<void> {
    const userData = this.getFormFieldValues();
    const userAuthRequest = await new ApiLearnWords().authorizeUser(userData);

    if (userAuthRequest.error) {
      this.message.innerHTML = userAuthRequest.error;
      makeActive(this.message);
    } else {
      const storageUserData = {
        authToken: userAuthRequest.success.token,
        authRefreshToken: userAuthRequest.success.token,
        userName: userAuthRequest.success.name,
        userId: userAuthRequest.success.userId
      };
      saveUserData(storageUserData);
      window.location.hash = window.location.hash === PAGE_INFO.home.hash ? '#' : PAGE_INFO.home.hash;
    }
  }

  private handleAuthSubmitBtnClick(): void {
    this.authSubmitButton.addEventListener('click', async event => {
      if (this.isInputFieldsValid()) {
        event.preventDefault();
        await this.performUserAuthorization();
      }
    });
  }

  private createAuthorizationForm(): void {
    const form = new BaseComponent<HTMLFormElement>(this.node, 'form', 'authorization-form').node;
    this.createFormField(form);
    this.authSubmitButton = new BaseComponent(form, 'button', 'authorization-form__login-button active', SUBMIT_BUTTON_NAMES.login).node;
    this.regSubmitButton = new BaseComponent(form, 'button', 'authorization-form__register-button', SUBMIT_BUTTON_NAMES.register).node;
    this.message = new BaseComponent(form, 'p', 'authorization-form__message').node;
    this.handleAuthSubmitBtnClick();
    this.handleRegSubmitBtnClick();
  }

  private createAuthorization(): void {
    const authLogo = new BaseComponent(this.node, 'div', 'authorization__logo');
    this.createAuthorizationControls();
    this.createAuthorizationForm();
  }
}

export default Authorization;
