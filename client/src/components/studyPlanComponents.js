import { useState } from "react";
import { Button, Col, Form, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { canRemoveCourse, canSubmit, creditsRange } from "../studyPlan-utils";

function StudyPlan(props) {
  const { studyPlan, setStudyPlan, setEditMode } = props;

  return <Col>
    <h2>My study plan</h2>
    {studyPlan ?
      <StudyPlanTable {...props} /> :
      <CreateStudyPlanForm setStudyPlan={setStudyPlan} setEditMode={setEditMode} />
    }
  </Col>
}

function StudyPlanTable(props) {
  const { courses, editMode, setEditMode, studyPlan, setStudyPlan, submitStudyPlan, flushStudyPlan } = props;
  const spCourses = studyPlan.courses;
  const { creditsMin, creditsMax } = creditsRange(studyPlan.isPartTime);
  const credits = courses
    .filter(c => spCourses.includes(c.code))
    .reduce((prev, cur) => prev + cur.credits, 0);

  const removeCourse = (courseCode) => {
    setStudyPlan((sp) => {
      return {
        ...sp,
        courses: sp.courses.filter(c => c !== courseCode),
      }
    });
  }

  return <Table className="table-hover">
    <thead>
      <tr>
        <th scope="col">Code</th>
        <th scope="col">Name</th>
        <th scope="col">Credits</th>
        {editMode && <th scope="col"></th>}
      </tr>
    </thead>
    <tbody>
      {spCourses.map(spCourse =>
        <StudyPlanRow key={spCourse}
          course={courses.find(c => c.code === spCourse)}
          editMode={editMode}
          canRemove={() => canRemoveCourse(spCourse, studyPlan, courses)}
          removeCourse={() => removeCourse(spCourse)}
        />
      )}
    </tbody>
    <tfoot>
      <tr>
        <td></td>
        <td><strong>Total credits</strong> / min-max credits</td>
        <td><strong>{credits}</strong> / {creditsMin}-{creditsMax}</td>
        {editMode && <td></td>}
      </tr>
      <tr><td colSpan={editMode ? 4 : 3}>
        {editMode ?
          <>
            <Button onClick={() => setEditMode(false)} >Cancel</Button>
            <Button disabled={!canSubmit(studyPlan, courses)} onClick={submitStudyPlan}>
              Submit
            </Button>
          </> :
          <>
            <Button onClick={() => setEditMode(true)} >Edit</Button>
            <Button onClick={flushStudyPlan}>Delete</Button>
          </>
        }
      </td></tr>
    </tfoot>
  </Table>
}

function StudyPlanRow(props) {
  const { course, canRemove, removeCourse, editMode } = props;
  const [canRem, canRemReason] = editMode ? canRemove() : [undefined, undefined];

  return <tr>
    <td>{course.code}</td>
    <td>{course.name}</td>
    <td>{course.credits}</td>
    {editMode && <td> {canRem ?
      <Button className="btn-danger" onClick={removeCourse}>
        <i className="bi bi-trash"></i>
      </Button> :
      <OverlayTrigger overlay={<Tooltip id={`tooltip-add-${course.code}`}>{canRemReason}</Tooltip>}>
        <span className="d-inline-block">
          <Button className="btn-danger" disabled={true}>
            <i className="bi bi-trash"></i>
          </Button>
        </span>
      </OverlayTrigger>
    }</td>
    }
  </tr >
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
    <Form.Check type='radio' label='Part-time' id='part-time-radio'
      checked={isPartTime} onChange={() => setIsPartTime(true)} />
    <Form.Check type='radio' label='Full-time' id='full-time-radio'
      checked={!isPartTime} onChange={() => setIsPartTime(false)} />
    <div className="d-grid">
      <Button type="submit" className="btn btn-primary">Next</Button>
    </div>
  </Form>
}

export { StudyPlan }