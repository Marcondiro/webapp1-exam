import { Button, Container, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function StudyPlanNavbar(props) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await props.logout();
      //After server logout flush state and go to un-auth courses view.
      //Use location replace instead of React useNavigate() to be sure that the full state is flushed.
      window.location.replace('/');
    } catch (err) {
      props.setError('An error occurred while trying to logout, please retry.');
    }
  };

  return <Navbar className="navbar-dark bg-primary">
    <Container fluid>
      <div className="d-flex align-items-center">
        <i className="bi bi-journal-bookmark-fill navbar-icon"></i>
        <h1 className="main-title d-none d-md-inline">Fooniversity</h1>
      </div>
      <div className="d-flex justify-content-end align-items-center">
        {props.user && <small className="welcome-text">Hi, {props.user.name}</small>}
        {props.logout ?
          <Button className="btn btn-light" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </Button> :
          <Button className="btn btn-light" onClick={() => navigate('/login')}>
            <i className="bi bi-box-arrow-in-right"></i> Login
          </Button>
        }
      </div>
    </Container>
  </Navbar>
}
