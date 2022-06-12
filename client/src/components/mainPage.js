import StudyPlanNavbar from './studyPlanNavbar';

import { Outlet } from 'react-router-dom';
import { Alert, Col, Container, Modal, Row } from 'react-bootstrap';
import CoursesTable from './coursesTable';

function MainPage(props) {
  return <>
    <header className="app-header">
      <StudyPlanNavbar logout={props.logout} user={props.user} />
    </header>
    <main>
      <Container fluid={true}>
        <Row className='main-row'>
          <Col>
            <h2>Courses</h2>
            <CoursesTable {...props} logout={undefined} />
          </Col>
          <Outlet />
        </Row>
      </Container>
    </main>
  </>
}

function ErrorMessageModal(props) {
  const handleClose = () => props.setError('');

  return <Modal show={props.error} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>
        <h2 className="text-danger">
          <i className="bi bi-exclamation-triangle-fill"></i> Ops...
        </h2>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Alert id='alert' variant='danger'>{props.error}</Alert>
    </Modal.Body>
  </Modal>
}

export { MainPage, ErrorMessageModal };
