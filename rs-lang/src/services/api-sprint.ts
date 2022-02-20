class Data {
  async getData(page: number, group: number) {
    const data = await fetch(
      `https://react-learnwords-example.herokuapp.com/words?$page=${page}&group=${group}`
    );
    const json = await data.json();
    return json;
  }
}

export default Data;
