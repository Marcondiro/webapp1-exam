import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './components/loginComponents';
import { MainPage } from './components/mainPage';
import { login, logout, getCourses } from './api';
import { Col } from 'react-bootstrap';

function App() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function getAndSetCourses() {
      try {
        const courses = await getCourses();
        setCourses(courses);
      } catch (e) {
        // TODO show error message
      }
    };
    getAndSetCourses();
  }, [setCourses]);

  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage logout={user ? () => logout(user) : undefined} courses={courses} />}>
          <Route path="courses" element={null} />
          <Route path="studyPlan/:studentId"
            element={user ? <Col>studyPlan</Col> : <Navigate to='/login' />} />
          <Route index element={<Navigate to='/courses' />} />
        </Route>
        <Route path="login" element={<LoginPage setUser={setUser} login={login} />} />
        <Route path="*" element={<Navigate to='/courses' />} />
      </Routes>
    </BrowserRouter>
  </div>
}

export default App;
