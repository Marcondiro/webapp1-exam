import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './components/loginComponents';
import { MainPage } from './components/mainPage';
import { login, logout, getCourses, getStudyPlan, createStudyPlan, updateStudyPlan, deleteStudyPlan } from './api';
import { StudyPlanView } from './components/studyPlanComponents';
import StudyPlan from './model/StudyPlan';

function App() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  //hasStudyPlan true if the user has a study plan saved in the back-end
  const [hasStudyPlan, setHasStudyPlan] = useState(false);
  // TODO use context for edit mode?
  const [editMode, setEditMode] = useState(false);

  const submitStudyPlan = async () => {
    try {
      if (hasStudyPlan) {
        await updateStudyPlan(user, studyPlan);
      } else {
        await createStudyPlan(studyPlan);
      }
      setEditMode(false);
    } catch (err) {
      // TODO show error message
    }
  }

  const flushStudyPlan = async () => {
    try {
      await deleteStudyPlan(user);
      setHasStudyPlan(false);
      setStudyPlan(null);

      const courses = await getCourses();
      setCourses(courses);
    } catch (err) {
      // TODO show error message
    }
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
  }, [editMode, setCourses]);

  useEffect(() => {
    async function getAndSetStudyPlan() {
      try {
        const studyPlan = await getStudyPlan(user);
        setStudyPlan(new StudyPlan(studyPlan.isPartTime, studyPlan.courses));
        setHasStudyPlan(Boolean(studyPlan));
      } catch (e) {
        // TODO show error message
      }
    };
    //Load study plan after login or after exiting edit mode
    if (user && !editMode)
      getAndSetStudyPlan();
  }, [user, editMode, setStudyPlan]);

  return <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage
          logout={user ? () => logout(user) : undefined}
          user={user}
          courses={courses} setCourses={setCourses}
          editMode={editMode}
          setStudyPlan={setStudyPlan}
          canAddCourse={(course) => studyPlan.canAddCourse(course, courses)}
        />}>
          <Route path="courses" element={null} />
          <Route path="studyPlan/:studentId"
            element={user ?
              <StudyPlanView
                studyPlan={studyPlan} setStudyPlan={setStudyPlan}
                submitStudyPlan={submitStudyPlan} flushStudyPlan={flushStudyPlan}
                editMode={editMode} setEditMode={setEditMode}
                courses={courses} setCourses={setCourses}/> :
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
