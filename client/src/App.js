import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './components/loginComponents';
import { MainPage } from './components/mainPage';
import { login, logout, getCourses, getStudyPlan } from './api';
import { StudyPlan } from './components/studyPlanComponents';
import { canAddCourse } from './studyPlan-utils';

function App() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const addCourseToSP = (courseCode) => {
    setStudyPlan(sp => {
      return {
        isPartTime: sp.isPartTime,
        courses: [...sp.courses, courseCode],
      }
    })
  }

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

  useEffect(() => {
    async function getAndSetStudyPlan() {
      try {
        const studyPlan = await getStudyPlan(user);
        setStudyPlan(studyPlan);
      } catch (e) {
        // TODO show error message
      }
    };
    if (user)
      getAndSetStudyPlan();
  }, [user, setStudyPlan]);

  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage
          logout={user ? () => logout(user) : undefined}
          courses={courses}
          editMode={editMode}
          addCourseToSP={addCourseToSP}
          canAddCourse={(course) => canAddCourse(course, studyPlan, courses)}
        />}>
          <Route path="courses" element={null} />
          <Route path="studyPlan/:studentId"
            element={user ?
              <StudyPlan studyPlan={studyPlan} setStudyPlan={setStudyPlan}
                editMode={editMode} setEditMode={setEditMode} courses={courses}/> :
              <Navigate to='/login' />
            } />
          <Route index element={<Navigate to='/courses' />} />
        </Route>
        <Route path="login" element={<LoginPage setUser={setUser} login={login} />} />
        <Route path="*" element={<Navigate to='/courses' />} />
      </Routes>
    </BrowserRouter>
  </div>
}

export default App;
