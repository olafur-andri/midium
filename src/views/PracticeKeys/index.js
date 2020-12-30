import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Common from '../../Common';
import * as midiService from '../../services/midiService';
import Practice from '../../services/Practice';

let practice;

const PracticeKeys = () => {
  const [done, setDone] = useState(false);
  const [currentTask, _setCurrentTask] = useState('');
  const currentTaskRef = useRef(currentTask);

  /**
   * The function that is run whenever the practice timer reaches 0
   */
  const practiceEndHandler = () => {
    midiService.removeKeyOnListener();
    setDone(true);
  };

  /**
   * A function needed to update value of 'currentTask' for event listeners too
   *
   * @param {String} newTask The new value of 'currentTaskRef.current'
   */
  const setCurrentTask = (newTask) => {
    currentTaskRef.current = newTask;
    _setCurrentTask(newTask);
  };

  /**
   * The function that is run whenever the user presses a key on the midi keyboard
   *
   * @param {String} noteName The name of the note that was played
   */
  const keyEventHandler = (noteName) => {
    const cleanName = noteName.replace(/[0-9]/g, '').replace(/\*/g, '');
    const isRightNote = cleanName === currentTaskRef.current;
    if (!isRightNote) { return; } // wrong note

    // right note was played, on to the next task
    setCurrentTask(practice.getNextTask());
  };

  useEffect(() => {
    practice = new Practice(Common.getAllNotes(), 100, 5);
    midiService.addKeyOnListener((noteName) => keyEventHandler(noteName));
    practice.setOnEndListener(practiceEndHandler);
    setCurrentTask(practice.start());

    // cleanup
    return () => {
      midiService.removeKeyOnListener();
      practice.stop();
    };
  }, []);

  return (
    <>
      <h1>Practice - Notes</h1>

      <div style={{ opacity: done ? 0.5 : 1 }}>
        <center>
          <p>Play this note:</p>
          <h2>{currentTask}</h2>
        </center>
      </div>

      <div style={{ opacity: Number(done) }}>
        <center>
          <p style={{ margin: 0 }}>Score</p>
          <h2 style={{ margin: 0 }}>
            {practice ? practice.getScore() : '-'}
          </h2>
          <NavLink exact to="/">Go Back</NavLink>
        </center>
      </div>
    </>
  );
};

export default PracticeKeys;
