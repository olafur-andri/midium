import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import * as midiService from '../../services/midiService';
import * as theoryService from '../../services/theoryService';
import Practice from '../../services/Practice';

let practice;

/**
 * Returns a list of all possible tasks that the user might have to finish in
 * this practice.
 *
 * @returns {String[]} All possible tasks
 */
const getAllPossibleTasks = () => {
  const allTasks = [];
  const allTriads = theoryService.getAllTriadNames();
  allTriads.forEach((triadName) => {
    allTasks.push(`Root position of ${triadName}`);
    allTasks.push(`1st inversion of ${triadName}`);
    allTasks.push(`2nd inversion of ${triadName}`);
  });
  return allTasks;
};

const PracticeInversions = () => {
  const [done, setDone] = useState(false);
  const [currentTask, _setCurrentTask] = useState('');
  const currentTaskRef = useRef(currentTask);

  /**
   * The function that is run whenever the practice timer reaches 0
   */
  const practiceEndHandler = () => {
    midiService.removeTriadOnListener();
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
  const keyEventHandler = (triadName, inversion) => {
    const task = currentTaskRef.current;

    // get the expected inversion
    let expectedInversion = 0;
    if (task.startsWith('1')) expectedInversion = 1;
    else if (task.startsWith('2')) expectedInversion = 2;

    // get the expected triad
    const words = task.split(' ');
    const triadBase = words[words.length - 2];
    const triadQuality = words[words.length - 1];
    const expectedTriad = `${triadBase} ${triadQuality}`;

    const correctInversion = inversion === expectedInversion;
    const correctTriad = triadName === expectedTriad;
    if (!correctTriad || !correctInversion) { return; }

    // right triad and inversion was played, on to the next task
    setCurrentTask(practice.getNextTask());
  };

  useEffect(() => {
    practice = new Practice(getAllPossibleTasks(), 100, 60 * 2);

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
      <h1>Practice - Inversions</h1>

      <div style={{ opacity: done ? 0.5 : 1 }}>
        <center>
          <p>Play this triad:</p>
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

export default PracticeInversions;
