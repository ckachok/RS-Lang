class AudioSound {
  playSound(url: string) {
    const audioObject = new Audio(url);
    audioObject.play();
  }
}

export default AudioSound;
