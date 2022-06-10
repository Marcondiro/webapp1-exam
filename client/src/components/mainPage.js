import StudyPlanNavbar from './studyPlanNavbar';

import { Outlet } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import CoursesTable from './coursesTable';

function MainPage(props) {
  return <>
    <header className="App-header sticky-top">
      <StudyPlanNavbar logout={props.logout} user={props.user} />
    </header>
    <main>
      <Container fluid={true}>
        <Row>
          <Col><h2>Courses</h2></Col>
          {props.user && <Col><h2>My study plan</h2></Col>}
        </Row>
        <Row>
          <Col>
            <CoursesTable {...props} logout={undefined} />
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
