/* eslint-disable no-underscore-dangle */

import Common from '../Common';

/**
 * The base class for each practice. Use this in your practice views to make the
 * handling of their logic more simple since all practices should follow the
 * same set of rules.
 */
export default class Practice {
  /**
   * The constructor for the BasePractice class of each practice. Use this in your
   *
   * @param {String[]} tasks An array containing the text that will be presented
   *                         for each task that the user might have to complete,
   *                         e.g. 'C', 'C#', 'D',... for notes practice.
   * @param {Number} maxScore The maximum score the user needs to get in order
   *                          to get 3 starts.
   * @param {Number} duration The duration of this practice, in seconds
   */
  constructor(tasks, maxScore, duration = 300) {
    /**
     * An array containing the text that will be presented for each task that
     * the user might have to complete, e.g. 'C', 'C#', 'D',... for notes
     * practice.
     * @type {String[]}
     * @private
     */
    this.__tasks = tasks;

    /**
     * Keeps track of how many tasks the user has completed since the beginning
     * of the practice.
     * @type {Number}
     * @private
     */
    this.__score = 0;

    /**
     * The maximum score the user needs to get in order to get 3 starts.
     * @type {Number}
     * @private
     */
    this.__maxScore = maxScore;

    /**
     * The duration of this pracitce, in seconds
     * @type {Number}
     * @private
     */
    this.__duration = duration;

    /**
     * The current task that the user is attempting to finish
     * @type {String}
     * @private
     */
    this.__currentTask = '';

    /**
     * The last task that the user finished
     * @type {String}
     * @private
     */
    this.__lastTask = '';

    /**
     * Keeps track of the current interval that is being used as a timer
     * @type {Number}
     * @private
     */
    this.__interval = 0;

    /**
     * The function that will be run when the practice comes to an end
     * @type {Function}
     * @private
     */
    this.__onEndListener = null;

    /* BINDINGS */
    this.__tick = this.__tick.bind(this);
  }

  /**
   * Starts the practice. Starts the clock and returns the first task.
   *
   * @returns {String} The first task that the user should complete
   */
  start() {
    this.__interval = setInterval(this.__tick, 1000); // start the clock
    this.__currentTask = this.__getRandomTask();
    return this.__currentTask;
  }

  /**
   * Stops the practice. Good for cleanup
   */
  stop() {
    clearInterval(this.__interval);
  }

  /**
   * Treat the current task as finished, also returns the next task that the
   * user should complete. This function makes sure that the user does not
   * receive the same task twice, as long as the nr of tasks is >= 2.
   *
   * @returns {String} The next track the user should finish
   */
  getNextTask() {
    this.__score += 1;
    this.__lastTask = this.__currentTask;
    this.__currentTask = this.__getRandomTask();
    return this.__currentTask;
  }

  /**
   * Overwrites the current 'on end' listener with the one that is given and
   * runs it only when the practice is over (timer reached 0).
   *
   * @param {Function} listener The new 'on end' listener
   */
  setOnEndListener(listener) {
    this.__onEndListener = listener;
  }

  /**
   * Gets a new random task, makes sure to not get the same task as last time
   *
   * @returns {String} A new and random task
   */
  __getRandomTask() {
    let newTask = this.__tasks[Common.randomInt(0, this.__tasks.length)];
    const enoughTasks = this.__tasks.length >= 2;
    const lastTaskExists = this.__lastTask !== '';

    // make sure to not get the same task twice in a row
    if (enoughTasks && lastTaskExists) {
      const invalidNewTask = newTask === this.__lastTask;
      while (invalidNewTask) {
        newTask = this.__tasks[Common.randomInt(0, this.__tasks.length)];
      }
    }

    return newTask;
  }

  /**
   * The function that is run every second, acts as a timer
   */
  __tick() {
    this.__duration -= 1;

    // handle the practice being stopped
    if (this.__duration <= 0) {
      if (this.__onEndListener !== null) { this.__onEndListener(); }
      clearInterval(this.__interval);
    }
  }
}
