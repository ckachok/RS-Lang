class AudioSound {
  playSound(url: string) {
    const audioObject = new Audio(`https://react-learnwords-example.herokuapp.com/${url}`);
    audioObject.play();
  }
}

export default AudioSound;
