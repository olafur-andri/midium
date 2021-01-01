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
   * Checks if the two given arrays contain the exact same elements, *in the
   * same order*
   *
   * @param {Array} arr1 Array nr. 1
   * @param {Array} arr2 Array nr. 2
   * @returns {Boolean} Do the two arrays contain the same elements?
   */
  static sameArrays(arr1, arr2) {
    const sameLength = arr1.length === arr2.length;

    // check each element
    let sameElems = true;
    for (let i = 0; i < arr1.length; i += 1) {
      if (arr1[i] !== arr2[i]) {
        sameElems = false;
        break;
      }
    }

    return sameLength && sameElems;
  }
}
