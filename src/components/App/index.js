import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PracticeOverview from '../../views/PracticeOverview';
import PracticeNotes from '../../views/PracticeNotes';
import PracticeKeys from '../../views/PracticeKeys';
import PracticeNoteDeg from '../../views/PracticeNoteDegrees';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={PracticeOverview} />
      <Route exact path="/practices/notes" component={PracticeNotes} />
      <Route exact path="/practices/keys" component={PracticeKeys} />
      <Route exact path="/practices/note-degrees" component={PracticeNoteDeg} />
    </Switch>
  );
}

export default App;
