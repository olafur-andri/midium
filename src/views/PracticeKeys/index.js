import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Common from '../../Common';
import * as midiService from '../../services/midiService';
import Practice from '../../services/Practice';

/* Global values */
let practice;

/**
 * Returns a solution (array of note names) for the given task
 *
 * @param {String} task The task to return solutions for
 * @returns {String[]} The solution to the given task
 */
const getTaskSolution = (task) => {
  const solution = Common.getScaleSolution(task);

  // create the "downwards" solution
  const mirror = [...solution].reverse();
  solution.push(...mirror);

  return solution;
};

const PracticeKeys = () => {
  const [done, setDone] = useState(false);
  const [currentTask, _setCurrentTask] = useState('');
  const [keyPosition, _setKeyPosition] = useState(0);
  const currentTaskRef = useRef(currentTask);
  const keyPositionRef = useRef(keyPosition);
  const taskSolutionRef = useRef([]);

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
    taskSolutionRef.current = getTaskSolution(newTask);
    console.log(taskSolutionRef.current);
    _setCurrentTask(newTask);
  };

  const setKeyPosition = (newPosition) => {
    keyPositionRef.current = newPosition;
    _setKeyPosition(newPosition);
  };

  /**
   * The function that is run whenever the user presses a key on the midi keyboard
   *
   * @param {String} noteName The name of the note that was played
   */
  const keyEventHandler = (noteName) => {
    const cleanName = noteName.replace(/[0-9]/g, '').replace(/\*/g, '');
    const isRightNote = cleanName === taskSolutionRef.current[keyPositionRef.current];
    if (!isRightNote) { // wrong note
      setKeyPosition(0);
      return;
    }

    // increment key position
    setKeyPosition(keyPositionRef.current + 1);

    // check if key is done, if so then on to the next task
    if (keyPositionRef.current >= taskSolutionRef.current.length) {
      setKeyPosition(0);
      setCurrentTask(practice.getNextTask());
    }
  };

  useEffect(() => {
    practice = new Practice(Common.getAllScaleNames(), 100, 60 * 5);
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
      <h1>Practice - Keys</h1>

      <div style={{ opacity: done ? 0.5 : 1 }}>
        <center>
          <p>Play this scale:</p>
          <h2>{currentTask}</h2>
          <p>{keyPosition}</p>
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
