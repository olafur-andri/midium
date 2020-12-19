import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PracticeOverview from '../../views/PracticeOverview';
import PracticeNotes from '../../views/PracticeNotes';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={PracticeOverview} />
      <Route exact path="/practices/notes" component={PracticeNotes} />
    </Switch>
  );
}

export default App;
