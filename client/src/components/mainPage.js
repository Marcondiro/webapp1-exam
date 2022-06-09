import StudyPlanNavbar from './studyPlanNavbar';

import { Outlet } from 'react-router-dom';

function MainPage(props) {
  return <>
    <header className="App-header">
      <StudyPlanNavbar logout={props.logout} />
    </header>
    <main>
      <Outlet />
    </main>
  </>
}

export default MainPage;

//className="col-md-9 col-12 below-nav"

// {message && <Row>
//     <div>
//       <Alert id='alert' variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
//     </div>
//   </Row>}
