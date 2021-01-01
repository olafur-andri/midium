import React from 'react';
import { NavLink } from 'react-router-dom';
import * as midiService from '../../services/midiService';
import styles from './styles.module.css';

const PracticeOverview = () => {
  midiService.removeKeyOffListener();
  midiService.removeKeyOnListener();

  return (
    <>
      <h1>Practice Overview</h1>
      <div className={styles.linksContainer}>
        <NavLink exact to="/practices/notes">Notes</NavLink>
        <NavLink exact to="/practices/keys">Keys</NavLink>
        <NavLink exact to="/practices/note-degrees">Note Degrees</NavLink>
        <NavLink exact to="/practices/triads">Triads</NavLink>
        <NavLink exact to="/practices/inversions">Inversions</NavLink>
        <NavLink exact to="/practices/triad-scales">Triad Scales</NavLink>
        <NavLink exact to="/practices/key-degree-triads">Key Degree Triads</NavLink>
      </div>
    </>
  );
};

export default PracticeOverview;
