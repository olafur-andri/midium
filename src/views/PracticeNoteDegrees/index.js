import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Common from '../../Common';
import * as midiService from '../../services/midiService';
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
  const allScales = Common.getAllScaleNames();
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
  const solution = Common.getScaleSolution(scaleName);
  return solution[degree - 1];
};

const PracticeNoteDegrees = () => {
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
    const isRightNote = cleanName === getTaskSolution(currentTaskRef.current);
    if (!isRightNote) { return; } // wrong note

    // right note was played, on to the next task
    setCurrentTask(practice.getNextTask());
  };

  useEffect(() => {
    practice = new Practice(getAllPossibleTasks(), 100, 60);

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
      <h1>Practice - Note degrees</h1>

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

export default PracticeNoteDegrees;
