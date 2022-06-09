import StudyPlanNavbar from './studyPlanNavbar';

import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import CoursesTable from './coursesTable';

function MainPage(props) {
  return <>
    <header className="App-header">
      <StudyPlanNavbar logout={props.logout} />
    </header>
    <main>
      <Container>
        <Row>
          <Col>
            <CoursesTable courses={props.courses} />
          </Col>
          <Outlet />
        </Row>
      </Container>
    </main>
  </>
}

function StudyPlan(props) {
  const [editMode, setEditMode] = useState(false);

}

export { MainPage, StudyPlan };

//className="col-md-9 col-12 below-nav"

// {message && <Row>
//     <div>
//       <Alert id='alert' variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
//     </div>
//   </Row>}
