import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { } from 'react-bootstrap';
import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './components/loginComponents';
import { login } from './api';

function App() {
  const [user, setUser] = useState(null);

  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser} login={ login } />} />
        <Route path="/courses" element={<div>I corsi dell'università!</div>} />
        <Route path="/studyPlan/:studentId" element={user ? <div>Ciao studente</div> : <Navigate to='/login' />} />
        <Route path="*" element={user ? <Navigate to={`/studyPlan/${user.id}`} /> : <Navigate to='/courses' />} />
      </Routes>
    </BrowserRouter>
  </div>
}

export default App;
