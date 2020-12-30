import React, { useEffect } from 'react';
import * as midiService from '../../services/midiService';
import Practice from '../../services/Practice';

const practice = new Practice(
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  100,
  2,
);

const keyEventHandler = (noteName) => {
  console.log(noteName);
};

const practiceEndHandler = () => console.log('Practice has ended!');

const PracticeNotes = () => {
  useEffect(() => {
    midiService.addKeyOnListener(keyEventHandler);
    practice.setOnEndListener(practiceEndHandler);
    practice.start();

    // cleanup
    return () => {
      midiService.removeKeyOnListener();
      practice.stop();
    };
  }, []);

  return <h1>Practice - Notes</h1>;
};

export default PracticeNotes;
