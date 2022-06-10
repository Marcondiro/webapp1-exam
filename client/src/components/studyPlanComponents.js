import { useState } from "react";
import { Button, Col, Form, Table } from "react-bootstrap";

function StudyPlan(props) {
  return <Col>
    <h2>My study plan</h2>
    {props.studyPlan ?
      <StudyPlanTable {...props} /> :
      <CreateStudyPlanForm setStudyPlan={props.setStudyPlan} setEditMode={props.setEditMode} />
    }
  </Col>
}

function StudyPlanTable(props) {
  const { courses } = props;
  const spCourses = props.studyPlan.courses;

  return <Table className="table-hover">
    <thead>
      <tr>
        <th scope="col">Code</th>
        <th scope="col">Name</th>
        <th scope="col">Credits</th>
      </tr>
    </thead>
    <tbody>
      {spCourses.map(spCourse =>
        <StudyPlanRow key={spCourse} course={courses.find(c => c.code === spCourse)} />
      )}
    </tbody>
  </Table>
}

function StudyPlanRow(props) {
  const { course } = props;
  return <tr>
    <td>{course.code}</td>
    <td>{course.name}</td>
    <td>{course.credits}</td>
  </tr>
}

function CreateStudyPlanForm(props) {
  const [isPartTime, setIsPartTime] = useState(false);

  const submit = event => {
    event.preventDefault();
    props.setStudyPlan({
      isPartTime: isPartTime,
      courses: [],
    })
    props.setEditMode(true);
  };

  return <Form onSubmit={submit}>
    <Form.Check type='radio' label='Part-time' id='is-part-time-radio'
      checked={isPartTime} onChange={() => setIsPartTime(true)} />
    <Form.Check type='radio' label='Full-time' id='is-part-time-radio'
      checked={!isPartTime} onChange={() => setIsPartTime(false)} />
    <div className="d-grid">
      <Button type="submit" className="btn btn-primary">Next</Button>
    </div>
  </Form>
}

export { StudyPlan }