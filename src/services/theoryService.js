import Common from '../Common';
import triads from '../data/triads.json';

/**
 * Returns a string array that includes the names of every semitone, in order,
 * starting from C
 *
 * @returns {String[]} Array of all note names
 */
export const getAllNotes = () => [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
];

/**
 * Takes in a triad and returns back which inversion of a triad is being played
 *
 * @param {Set<Number>} notes The triad's notes' numeric values
 * @returns {Number} The triad's inversion (0-2, or -1 if invalid inversion)
 */
export const getTriadInversion = (notes) => {
  const sortedValues = Array.from(notes).sort((x, y) => x - y);
  const deltas = [];

  // get deltas between notes
  for (let i = 1; i < sortedValues.length; i += 1) {
    deltas.push(sortedValues[i] - sortedValues[i - 1]);
  }

  // TODO: Add inversions for diminished chords
  // check if root position
  const is0 = Common.sameArrays(deltas, [3, 4])
           || Common.sameArrays(deltas, [4, 3]);
  const is1 = Common.sameArrays(deltas, [4, 5])
           || Common.sameArrays(deltas, [3, 5]);
  const is2 = Common.sameArrays(deltas, [5, 3])
           || Common.sameArrays(deltas, [5, 4]);
  if (is0) { return 0; }
  if (is1) { return 1; }
  if (is2) { return 2; }
  return -1;
};

/**
 * Returns an array of note names (solution) that belongs to the given scale,
 * only up.
 *
 * @param {String} scale The scale to return solutions for, e.g. 'A# major'
 * @returns {String[]} The solution to the given task
 */
export const getScaleSolution = (scale) => {
  const solution = [];
  const allNotes = getAllNotes();
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
};

/**
 * Returns a string array that contains the names of every scale used in the
 * different practices
 *
 * @returns {String[]} Array of all scales
 */
export const getAllScaleNames = () => {
  const allTasks = [];
  const allNotes = getAllNotes();

  allNotes.forEach((note) => {
    allTasks.push(`${note} major`);
    allTasks.push(`${note} minor`);
  });

  return allTasks;
};

/**
 * Returns an array of all triad names
 */
export const getAllTriadNames = () => {
  // TODO: Add diminished chords
  const allTriadNames = [];
  const allNotes = getAllNotes();
  allNotes.forEach((note) => {
    allTriadNames.push(`${note} major`);
    allTriadNames.push(`${note} minor`);
  });
  return allTriadNames;
};

/**
 * Takes in a note name of the example form 'C#3' or 'C#*' and cleans it up,
 * returning only the actual name of the note, without stars and numbers.
 *
 * @param {String} noteName The name of the note to clean up
 * @returns {String} The cleaned-up note name
 */
const getCleanNoteName = (noteName) => noteName
  .replace(/[0-9]/g, '')
  .replace(/\*/g, '');

/**
 * Takes in an array of note names and returns the name of the triad that
 * contains those notes.
 *
 * @param {String[]} noteNames The names of the notes to detect the triad from
 * @returns {String} The triad name, e.g. 'A major'
 */
export const getTriadName = (noteNames) => {
  let answer = '';

  // clean up all note names
  const cleanNames = noteNames.map((name) => getCleanNoteName(name));

  // traverse through all possible triads to figure out which one it is
  const keys = Object.keys(triads);

  for (let i = 0; i < keys.length; i += 1) {
    const triadName = keys[i];
    const triadNotes = triads[triadName];
    const isTriad = cleanNames.every((cleanName) => triadNotes.includes(cleanName));
    if (isTriad) {
      answer = triadName;
      break;
    }
  }

  return answer;
};

/**
 * Returns an array of note names (solution) that belong to the given triad.
 *
 * @param {String} triadName The name of the triad to find a solution for
 * @returns {String[]} The solution to the given triad
 */
export const getTriadSolution = (triadName) => {
  if (triadName in triads) return triads[triadName];
  return [];
};
