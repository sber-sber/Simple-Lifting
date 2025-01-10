import './App.css';
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditExercisePage from './pages/EditExercisePage';
import CreateExercisePage from './pages/CreateExercisePage';
import { useState } from 'react';

function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState();

  return (
    <div className="App">
      <header className="App-header">
            <h1>Exercise Types Management App</h1>
            <p>With this app, add, edit, update, and delete the individual exercises in your workout routine.</p>
      </header>    
          <Router>
            <Navigation/>
            <Routes>
              <Route path="/" exact element = {
                <HomePage setExerciseToEdit={setExerciseToEdit}
                />}>
              </Route>
              <Route path="/create-exercise" element = {
                <CreateExercisePage
                />}>
              </Route>
              <Route path="/edit-exercise" element = {
                <EditExercisePage exerciseToEdit={exerciseToEdit}  
                />}>
              </Route>            
            </Routes>
          </Router>
        <footer>
          <p>© 2023, Samuel Berven</p>
        </footer>
    </div>
  );
}

export default App;
