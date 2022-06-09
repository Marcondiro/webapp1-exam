import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './components/loginComponents';
import MainPage from './components/mainPage';
import { login, logout } from './api';

function App() {
  const [user, setUser] = useState(null);

  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage logout={user ? () => logout(user) : undefined} />}>
          <Route path="courses" element={<>courses table</>} />
          <Route path="studyPlan/:studentId"
            element={user ? <p>studyPlan</p> : <Navigate to='/login' />} />
          <Route index element={<Navigate to='/courses' />} />
        </Route>
        <Route path="login" element={<LoginPage setUser={setUser} login={login} />} />
        <Route path="*" element={<Navigate to='/courses' />} />
      </Routes>
    </BrowserRouter>
  </div>
}

export default App;
