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

  /**
   * Returns a string array that contains the names of every scale used in the
   * different practices
   *
   * @returns {String[]} Array of all scales
   */
  static getAllScaleNames() {
    const allTasks = [];
    const allNotes = this.getAllNotes();

    allNotes.forEach((note) => {
      allTasks.push(`${note} major`);
      allTasks.push(`${note} minor`);
    });

    return allTasks;
  }

  /**
   * Returns an array of note names (solution) that belongs to the given scale,
   * only up.
   *
   * @param {String} scale The scale to return solutions for, e.g. 'A# major'
   * @returns {String[]} The solution to the given task
   */
  static getScaleSolution(scale) {
    const solution = [];
    const allNotes = Common.getAllNotes();
    const splitTask = scale.split(' ');
    const scaleName = splitTask[0].toUpperCase();
    const scaleQuality = splitTask[1].toLowerCase();
    const patterns = {
      major: [2, 2, 1, 2, 2, 2, 1],
      minor: [2, 1, 2, 2, 1, 2, 2],
    };

    // create the "upwards" solution
    const pattern = patterns[scaleQuality];
    let index = allNotes.indexOf(scaleName);
    pattern.forEach((jump) => {
      solution.push(allNotes[index]);
      index += jump;
      index %= allNotes.length; // circular increment
    });
    solution.push(scaleName); // add last note

    return solution;
  }
}
