import { IWordData } from 'types/interfaces';
import Data from '../../../services/audio-api';

class LevelData {
  data: Data;

  constructor() {
    this.data = new Data();
  }

  generateRandomNumber(): number {
    return Math.trunc(Math.random() * 20);
  }

  async getWordsData(num: number) {
    const data = await this.data.getData(1, num);
    return data;
  }

  generateAnswers(data: Array<IWordData>): Array<string> {
    const ANSWERS: Array<string> = [];
    do {
      const newWord = data[this.generateRandomNumber()].wordTranslate;
      if (!ANSWERS.includes(newWord)) {
        ANSWERS.push(newWord);
      }
    } while (ANSWERS.length < 4);
    return ANSWERS;
  }
}

export default LevelData;
