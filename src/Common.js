/**
 * A static class that encapsulates all 'trivial' functionality used by the
 * different components, services and practices throughout this codebase.
 */
export default class Common {
  /**
   * Halts computation for the given amount of time
   *
   * @param {Number} ms The number of milliseconds to sleep for
   * @returns {Promise} You'll need to use await for this function to work
   */
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Returns a random integer on the given range.
   *
   * @param {Number} min The lowest number in the range (inclusive)
   * @param {Number} max The greates number in the range (exclusive)
   * @returns {Number} The random integer
   */
  static randomInt(min, max) {
    const r = Math.random();
    const delta = Math.floor(max - min);
    return min + Math.floor(delta * r);
  }

  /**
   * Returns a string array that includes the names of every semitone, in order,
   * starting from C
   *
   * @returns {String[]} Array of all note names
   */
  static getAllNotes() {
    return [
      'C', 'C#', 'D', 'D#', 'E', 'F',
      'F#', 'G', 'G#', 'A', 'A#', 'B',
    ];
  }
}
