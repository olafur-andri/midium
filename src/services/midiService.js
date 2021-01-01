import Common from '../Common';
import * as theoryService from './theoryService';

/* Global values */
const EVENT_TYPE = 0;
const NOTE_VALUE = 1;
const NOTE_VELOCITY = 2;
const NOTE_ON = 144;
const NOTE_OFF = 128;
const KEYBOARD_ON = true;
const activeNotes = new Set();
let midiAccessed = false;
let keyOnEventHandler = null;
let keyOffEventHandler = null;
let triadOnEventListener = null;
let shiftDown = false;

/**
 * Returns true if midi operations are enabled on this browser, false otherwise
 *
 * @return {Boolean} true or false depending on whether midi is enabled or not
 */
const isMidiSupported = () => Boolean(navigator.requestMIDIAccess);

const getNoteName = (noteValue) => {
  const notes = theoryService.getAllNotes();
  const noteIndex = noteValue % notes.length;
  const noteName = notes[noteIndex];
  const noteNumber = Math.floor((noteValue - 24) / notes.length) + 1;
  return `${noteName}${noteNumber}`;
};

/**
 * The function that is run whenever the user presses a key on their MIDI
 * keyboard
 *
 * @param {Event} e An object that represents the fired event
 */
const onMidiMessage = (e) => {
  const keyOn = e.data[EVENT_TYPE] === NOTE_ON;
  const keyOff = e.data[EVENT_TYPE] === NOTE_OFF;
  const onHandlerExists = keyOnEventHandler != null;
  const offHandlerExists = keyOffEventHandler != null;
  const noteName = getNoteName(e.data[NOTE_VALUE]);
  const velocity = e.data[NOTE_VELOCITY];

  if (keyOn && onHandlerExists) keyOnEventHandler(noteName, velocity);
  else if (keyOff && offHandlerExists) keyOffEventHandler(noteName, velocity);

  /* Processing for 'triad on' event listener */
  if (keyOn) activeNotes.add(e.data[NOTE_VALUE]);
  else if (keyOff) activeNotes.delete(e.data[NOTE_VALUE]);

  // only continue if there are precisely three active notes
  if (activeNotes.size !== 3) { return; }

  // get information about the triad
  const inversion = theoryService.getTriadInversion(activeNotes);
  const activeNoteNames = Array.from(activeNotes)
    .map((noteValue) => getNoteName(noteValue));
  const triadName = theoryService.getTriadName(activeNoteNames);

  // don't continue if it's not a valid triad
  if (inversion === -1 || triadName === '') { return; }

  // call the event listener since it's a valid triad
  if (triadOnEventListener) triadOnEventListener(triadName, inversion);
};

/**
 * Returns 'true' if the given key name is a valid note name ('a'-'g')
 *
 * @param {String} keyName The name of the key that was pressed/released
 * @return {Boolean} is the given key name a valid note name?
 */
const isValidKeyboardNote = (keyName) => {
  const validKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  return validKeys.includes(keyName.toLowerCase());
};

/**
 * The function that is run whenever the user presses a key on their keyboard
 *
 * @param {KeyboardEvent} e An object that represents the fired event
 */
const onKeyboardMessage = (e) => {
  const keyOn = e.type === 'keydown';
  const keyOff = e.type === 'keyup';
  if (e.key.toLowerCase() === 'shift') {
    shiftDown = keyOn;
  }

  // don't continue if pressed key does not contain a valid note
  if (!isValidKeyboardNote(e.key)) { return; }
  const onHandlerExists = keyOnEventHandler != null;
  const offHandlerExists = keyOffEventHandler != null;
  const velocity = Math.floor(127 / 2); // mid-velocity

  // get note's name
  const addSharp = shiftDown && !['B', 'E'].includes(e.key.toUpperCase());
  const noteName = `${e.key.toUpperCase()}${addSharp ? '#' : ''}*`;

  if (keyOn && onHandlerExists) keyOnEventHandler(noteName, velocity);
  else if (keyOff && offHandlerExists) keyOffEventHandler(noteName, velocity);
};

/**
 * Requests access to MIDI devices
 */
const requestMidiAccess = async () => {
  let midiAccess = null;

  // add keyboard events too if that setting is turned on
  if (KEYBOARD_ON) {
    window.addEventListener('keydown', onKeyboardMessage);
    window.addEventListener('keyup', onKeyboardMessage);
  }

  // request MIDI access and handle errors
  try {
    midiAccess = await navigator.requestMIDIAccess({ sysex: false });
  } catch (err) {
    console.log('Error while requesting midi access:', err.message);
    return;
  }

  // check if there are any devices available
  console.log('Requesting MIDI access was a success');
  const devicesAvailable = midiAccess.inputs.size > 0;
  if (!devicesAvailable) { console.log('no MIDI devices available'); return; }

  // Yay! We found MIDI devices
  midiAccess.inputs.forEach((key) => {
    if (midiAccessed) { return; }
    midiAccessed = true;
    console.log('listening to device:', key.name);

    const modKey = key;
    modKey.onmidimessage = onMidiMessage;
  });
};

/**
 * Sets 'handler' as the current event handler that runs whenever a key on the
 * midi keyboard is pressed down
 *
 * @param {Function} handler The new key event handler
 */
export const setKeyOnListener = async (handler) => {
  if (!isMidiSupported()) { console.error('MIDI not supported!'); return; }
  if (!midiAccessed) { await requestMidiAccess(); }

  // set the given function as the key event listener
  keyOnEventHandler = handler;
};

/**
 * Sets 'handler' as the current event handler that runs whenever a key on the
 * midi keyboard is released
 *
 * @param {Function} handler The new key event handler
 */
export const setKeyOffListener = async (handler) => {
  if (!isMidiSupported()) { console.error('MIDI not supported!'); return; }
  if (!midiAccessed) { await requestMidiAccess(); }

  // set the given function as the key event listener
  keyOffEventHandler = handler;
};

/**
 * Set the function as the 'triad on' event handler. The given function will
 * therefore be run whenever the user plays a simple triad.
 *
 * @param {Function} handler The function that is run whenever a triad is played
 */
export const setTriadOnListener = async (handler) => {
  if (!isMidiSupported()) { console.error('MIDI not supported!'); return; }
  if (!midiAccessed) { await requestMidiAccess(); }

  // set the given function as the chord event listener
  triadOnEventListener = handler;
};

/**
 * Removes the current key on event listener, important for clean-up purposes
 */
export const removeKeyOnListener = () => {
  keyOnEventHandler = null;
};

/**
 * Removes the current key off event listener, important for clean-up purposes
 */
export const removeKeyOffListener = () => {
  keyOffEventHandler = null;
};

/**
 * Removes the current 'triad on' event listener, good for clean-up
 */
export const removeTriadOnListener = () => {
  triadOnEventListener = null;
};
