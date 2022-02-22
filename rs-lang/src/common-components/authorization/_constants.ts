export const FIELD_DATA = [
  {
    name: 'имя пользователя',
    type: 'text',
    pattern: '^(?=.{3,15}$)[a-zA-ZA-я]+[a-zA-ZA-я]+$',
    title: 'Имя должно содержать от 3 до 15 символов латинского и/или русского алфавита',
    required: false
  },
  {
    name: 'адрес электронной почты',
    type: 'email',
    pattern: '([a-z0-9_-]{3,15})@([a-z]{4,}).([a-z]{2,})',
    title: `Email должен быть вида username@example.com, где: 
    - username - должно содержать от 3 до 15 символов (латинские буквы, цифры, знак подчёркивания, дефис);
    - example - домен первого уровня состоит минимум из 4 латинских букв;
    - com - домен верхнего уровня, отделяется от домена первого уровня точкой и состоит минимум из 2 латинских букв.`,
    required: true
  },
  {
    name: 'пароль',
    type: 'password',
    pattern: '^(?=.{8,16}$)[0-9A-z]+[0-9A-z]+$',
    title: 'Пароль должен содержать от 8 до 16 символов (латинские буквы и/или цифры)',
    required: true
  }
];

export const SWITCH_BUTTONS_NAMES = {
  authorization: 'Авторизация',
  registration: 'Регистрация'
};

export const SUBMIT_BUTTON_NAMES = {
  login: 'Войти',
  register: 'Зарегистрироваться'
};

export const REG_SUCCESSFUL_MESSAGE = 'Пользователь успешно создан, пройдите авторизацию';
