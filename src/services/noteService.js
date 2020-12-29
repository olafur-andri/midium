// TODO: Replace the class with a function-based service since we can't have
// private methods

export default class NoteService {
  constructor() {
    this.context = new AudioContext();
  }

  async playNote() {
    const URL = this.encode(`${process.env.PUBLIC_URL}/audio/individual-notes/A#3.mp3`);

    // fetch audio and put it into a buffer
    window.fetch(URL)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => this.play(audioBuffer));
  }

  play(audioBuffer) {
    const source = this.context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.context.destination);
    source.start();
  }

  /**
   * Replaces URL-unfriendly symbols from the given URL
   *
   * @param {String} url the URL to encode
   * @return {String} the encoded URL
   */
  encode(url) {
    return url.replaceAll('#', encodeURIComponent('#'));
  }
}
