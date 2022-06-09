import { useState } from "react";
import { Button, Col, Form, Table } from "react-bootstrap";

function StudyPlan(props) {
  return <Col>
    <h2>My study plan</h2>
    {props.studyPlan ?
      <StudyPlanTable {...props} /> :
      <CreateStudyPlanForm setStudyPlan={props.setStudyPlan} setEditMode={props.setEditMode}/>
    }
  </Col>
}

function StudyPlanTable(props) {
  const { courses } = props.studyPlan;

  return <Table className="table-hover">
    <thead>
      <tr>
        <th scope="col">Code</th>
        <th scope="col">Name</th>
      </tr>
    </thead>
    <tbody>
      {[...courses].sort((a, b) => a.name.localeCompare(b.name)).map(c =>
        <tr key={c.code}><td>{c} </td></tr>
      )}
    </tbody>
  </Table>
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