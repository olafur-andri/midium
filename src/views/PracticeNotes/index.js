import React, { useEffect } from 'react';
import * as midiService from '../../services/midiService';
import NoteService from '../../services/noteService';

const noteService = new NoteService();

const keyEventHandler = (noteName) => {
  noteService.playNote();
  console.log(noteName);
};

const PracticeNotes = () => {
  useEffect(() => {
    midiService.addKeyOnListener(keyEventHandler);
    return () => midiService.removeKeyOnListener;
  }, []);

  return <h1>Practice - Notes</h1>;
};

export default PracticeNotes;
