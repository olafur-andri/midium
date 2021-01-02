import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import * as midiService from '../../services/midiService';
import * as theoryService from '../../services/theoryService';
import Practice from '../../services/Practice';

let practice;

/**
 * Returns an array containing every possible task that the user has to solve
 * in this practice
 *
 * @returns {String[]} An array containing all possible tasks
 */
const getAllPossibleTasks = () => {
  const allTasks = [];
  const allScales = theoryService.getAllScaleNames();
  // doesn't make sense to have an 8th degree for this practice
  const allDegrees = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];

  // add degrees on top of all scale names
  allScales.forEach((scaleName) => {
    allDegrees.forEach((degree) => {
      allTasks.push(`${degree} degree of ${scaleName}`);
    });
  });

  return allTasks;
};

/**
 * Returns the correct note that the user needs to play in order to finish this
 * task.
 *
 * @param {String} task The current task that the user needs to finish, e.g.
 *                      '7th degree of F# minor'
 * @returns {String} The name of the correct note
 */
const getTaskSolution = (task) => {
  // extract degree
  const degree = Number(task[0]);

  // extract scale name
  const words = task.split(' ');
  const scaleBase = words[words.length - 2];
  const scaleQuality = words[words.length - 1];
  const scaleName = `${scaleBase} ${scaleQuality}`;

  // figure out the correct note
  const allTriads = theoryService.getAllTriadsInScale(scaleName);
  return allTriads[degree - 1];
};

const PracticeNoteDegrees = () => {
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
   * @param {String} triadName The name of the triad that was played
   */
  const keyEventHandler = (triadName) => {
    const isRightTriad = triadName === getTaskSolution(currentTaskRef.current);
    if (!isRightTriad) { return; } // wrong triad

    // right triad was played, on to the next task
    setCurrentTask(practice.getNextTask());
  };

  useEffect(() => {
    practice = new Practice(getAllPossibleTasks(), 100, 60);

    midiService.setTriadOnListener((noteName) => keyEventHandler(noteName));
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
      <h1>Practice - Triad degrees</h1>

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

export default PracticeNoteDegrees;
