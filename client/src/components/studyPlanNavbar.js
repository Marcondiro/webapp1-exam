import { Button, Container, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function StudyPlanNavbar(props) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await props.logout();
    } finally {
      //After server logout flush state and go to un-auth courses view.
      //Use location replace instead of React useNavigate() to be sure that the full state is flushed.
      window.location.replace('/');
    }
  };

  // TODO: fix col-4, on small screens cols are less than 12
  return <Navbar className="navbar-dark bg-primary">
    <Container fluid>
      <div className="col-4 d-flex align-items-center">
        <i className="bi bi-journal-bookmark-fill navbar-icon"></i>
      </div>
      <div className="col-4 d-flex justify-content-center align-items-center">
        <h1 className="d-none d-md-inline main-title">Fooniversity</h1>
      </div>
      <div className="col-4 d-flex justify-content-end align-items-center">
        {props.user && <small className="welcome-text">{props.user.username}</small>}
        {props.logout ?
          <Button className="btn btn-light" onClick={logout}>Logout</Button> :
          <Button className="btn btn-light" onClick={() => navigate('/login')}>Login</Button>
        }
      </div>
    </Container>
  </Navbar>
}
