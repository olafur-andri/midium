import React, { useEffect } from 'react';
import * as midiService from '../../services/midiService';

const keyEventHandler = (noteName) => {
  console.log('note name:', noteName);
};

const PracticeNotes = () => {
  useEffect(() => {
    midiService.addKeyOnListener(keyEventHandler);
    return () => midiService.removeKeyOnListener;
  }, []);

  return <h1>Practice - Notes</h1>;
};

export default PracticeNotes;
