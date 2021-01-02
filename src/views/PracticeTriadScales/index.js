import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import * as midiService from '../../services/midiService';
import * as theoryService from '../../services/theoryService';
import Practice from '../../services/Practice';

let practice;

/**
 * Takes in a task (scale name) and returns the triads that the user will have
 * to play in order to finish it, in the correct order.
 *
 * @param {String} task The next task that the user will need to finish
 * @returns {String[]} The triads to finish the given task
 */
const getTaskSolution = (task) => {
  const solution = theoryService.getAllTriadsInScale(task);

  // add last triad
  solution.push(solution[0]);

  // add "downwards" solution
  const mirror = [...solution].reverse();
  solution.push(...mirror);

  console.log('solution:', solution);

  return solution;
};

const PracticeTriadScales = () => {
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
    taskSolutionRef.current = getTaskSolution(newTask);
    _setCurrentTask(newTask);
  };

  /**
   * A function needed to update the value of 'keyPosition' for event listeners
   * too
   *
   * @param {Number} newPosition The new value for 'keyPosition'
   */
  const setKeyPosition = (newPosition) => {
    keyPositionRef.current = newPosition;
    _setKeyPosition(newPosition);
  };

  /**
   * The function that is run whenever the user presses a key on the midi keyboard
   *
   * @param {String} triadName The name of the note that was played
   */
  const keyEventHandler = (triadName) => {
    // get the expected triad
    const expectedTriad = taskSolutionRef.current[keyPositionRef.current];

    // check if the played triad is the correct one
    const correctTriad = triadName === expectedTriad;
    if (!correctTriad) {
      setKeyPosition(0);
      return;
    }

    // increment key position since the right triad was playeed
    setKeyPosition(keyPositionRef.current + 1);

    // check if triad scale is done, if so, then on to the next task
    if (keyPositionRef.current >= taskSolutionRef.current.length) {
      setKeyPosition(0);
      setCurrentTask(practice.getNextTask());
    }
  };

  useEffect(() => {
    practice = new Practice(theoryService.getAllScaleNames(), 100, 60 * 2);

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
      <h1>Practice - Triad Scales</h1>

      <div style={{ opacity: done ? 0.5 : 1 }}>
        <center>
          <p>Play this triad scale:</p>
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

export default PracticeTriadScales;
