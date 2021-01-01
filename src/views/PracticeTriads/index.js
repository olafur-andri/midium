import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import * as midiService from '../../services/midiService';
import * as theoryService from '../../services/theoryService';
import Practice from '../../services/Practice';

let practice;

const PracticeTriads = () => {
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
   * @param {String} triadName The name of the note that was played
   */
  const keyEventHandler = (triadName) => {
    const correctTriad = triadName === currentTaskRef.current;
    if (!correctTriad) { return; }

    // right triad was played, on to the next task
    setCurrentTask(practice.getNextTask());
  };

  useEffect(() => {
    practice = new Practice(theoryService.getAllTriadNames(), 100, 60);

    midiService.setTriadOnListener(keyEventHandler);
    practice.setOnEndListener(practiceEndHandler);
    setCurrentTask(practice.start());

    // cleanup
    return () => {
      midiService.removeTriadOnListener();
      practice.stop();
    };
  }, []);

  return (
    <>
      <h1>Practice - Triads</h1>

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

export default PracticeTriads;
