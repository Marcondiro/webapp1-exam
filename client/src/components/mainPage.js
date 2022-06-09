import StudyPlanNavbar from './studyPlanNavbar';

import { Outlet } from 'react-router-dom';
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
            <h2>Courses</h2>
            <CoursesTable courses={props.courses} />
          </Col>
          <Outlet />
        </Row>
      </Container>
    </main>
  </>
}

export { MainPage };

//className="col-md-9 col-12 below-nav"

// {message && <Row>
//     <div>
//       <Alert id='alert' variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
//     </div>
//   </Row>}
