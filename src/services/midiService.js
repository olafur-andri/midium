/* Global values */
const EVENT_TYPE = 0;
const NOTE_VALUE = 1;
const NOTE_VELOCITY = 2;
const NOTE_ON = 144;
const NOTE_OFF = 128;
let midiAccessed = false;
let keyOnEventHandler = null;
let keyOffEventHandler = null;

/**
 * Returns true if midi operations are enabled on this browser, false otherwise
 *
 * @return {Boolean} true or false depending on whether midi is enabled or not
 */
const isMidiSupported = () => Boolean(navigator.requestMIDIAccess);

const getNoteName = (noteValue) => {
  const notes = [
    'C', 'C#', 'D', 'D#', 'E', 'F',
    'F#', 'G', 'G#', 'A', 'A#', 'B',
  ];
  const noteIndex = noteValue % notes.length;
  const noteName = notes[noteIndex];
  const noteNumber = Math.floor((noteValue - 24) / notes.length) + 1;
  return `${noteName}${noteNumber}`;
};

/**
 * The function that is run whenever the user presses a key on their MIDI
 * keyboard
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
};

/**
 * Requests access to MIDI devices
 */
const requestMidiAccess = async () => {
  let midiAccess = null;

  // request MIDI access and handle errors
  try {
    midiAccess = await navigator.requestMIDIAccess({ sysex: true });
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
export const addKeyOnListener = async (handler) => {
  if (!isMidiSupported()) { return; }
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
export const addKeyOffListener = async (handler) => {
  if (!isMidiSupported()) { return; }
  if (!midiAccessed) { await requestMidiAccess(); }

  // set the given function as the key event listener
  keyOffEventHandler = handler;
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
