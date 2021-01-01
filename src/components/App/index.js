import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PracticeOverview from '../../views/PracticeOverview';
import PracticeNotes from '../../views/PracticeNotes';
import PracticeKeys from '../../views/PracticeKeys';
import PracticeNoteDeg from '../../views/PracticeNoteDegrees';
import PracticeTriads from '../../views/PracticeTriads';
import PracticeInversions from '../../views/PracticeInversions';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={PracticeOverview} />
      <Route exact path="/practices/notes" component={PracticeNotes} />
      <Route exact path="/practices/keys" component={PracticeKeys} />
      <Route exact path="/practices/note-degrees" component={PracticeNoteDeg} />
      <Route exact path="/practices/triads" component={PracticeTriads} />
      <Route exact path="/practices/inversions" component={PracticeInversions} />
    </Switch>
  );
}

export default App;
