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

  async getWordsData(num: number): Promise<any> {
    const data = await this.data.getData(1, num);
    return data;
  }

  generateAnswers(data: Array<IWordData>, answersArray: Array<string>): Array<string> {
    do {
      const newWord = data[this.generateRandomNumber()].wordTranslate;
      if (!answersArray.includes(newWord)) {
        answersArray.push(newWord);
      }
    } while (answersArray.length < 5);
    return answersArray;
  }
}

export default LevelData;
