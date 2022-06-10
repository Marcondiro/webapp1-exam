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
  return <Navbar className="navbar navbar-dark bg-primary position-sticky top-0">
    <Container fluid>
      <h1 className="main-title col-4">
        <i className="bi bi-journal-bookmark-fill"></i>
      </h1>
      <div className="col-4 d-flex">
        <h2 className="d-none d-md-inline">Fooniversity</h2>
      </div>
      <div className="col-4 d-flex flex-row-reverse">
        {props.logout ?
          <Button className="btn btn-light" onClick={logout}>Logout</Button> :
          <Button className="btn btn-light" onClick={() => navigate('/login')}>Login</Button>
        }
      </div>
    </Container>
  </Navbar>
}
