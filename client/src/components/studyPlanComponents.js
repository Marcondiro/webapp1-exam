import { useState } from "react";
import { Button, Col, Form, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { canRemoveCourse, canSubmit, creditsRange } from "../studyPlan-utils";

function StudyPlan(props) {
  const { studyPlan, setStudyPlan, setEditMode } = props;

  return <Col>
    <div>
      <h2>My study plan</h2>
      {studyPlan ?
        <StudyPlanTable {...props} /> :
        <CreateStudyPlanForm setStudyPlan={setStudyPlan} setEditMode={setEditMode} />
      }
    </div>
  </Col>
}

function StudyPlanTable(props) {
  const { courses, setCourses, editMode, setEditMode, } = props;
  const { studyPlan, setStudyPlan, submitStudyPlan, flushStudyPlan, } = props;
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
    setCourses(courses =>
      courses.map(c => c.code === courseCode ? { ...c, students: c.students - 1 } : c)
    )
  }

  return <Table>
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
          <div className="d-flex justify-content-between">
            <Button className="btn-secondary" onClick={() => setEditMode(false)} >Cancel</Button>
            {canSubmit(studyPlan, courses) ?
              <Button onClick={submitStudyPlan}>
                Submit
              </Button> :
              <OverlayTrigger overlay={<Tooltip id={`tooltip-submit`}>Total credits below minimum</Tooltip>}>
                <span className="d-inline-block">
                  <Button disabled={true}>
                    Submit
                  </Button>
                </span>
              </OverlayTrigger>
            }
          </div> :
          <div className="d-flex justify-content-between">
            <Button className="btn-danger" onClick={flushStudyPlan}>Delete</Button>
            <Button onClick={() => setEditMode(true)} >Edit</Button>
          </div>
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
      <OverlayTrigger overlay={<Tooltip id={`tooltip-remove-${course.code}`}>{canRemReason}</Tooltip>}>
        <span className="d-inline-block">
          <Button className="btn-danger" disabled={true}>
            <i className="bi bi-trash"></i>
          </Button>
        </span>
      </OverlayTrigger>
    }</td>
    }
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
    <h4>Choose the desired curricula</h4>
    <Form.Check type='radio' label='Part-time' id='part-time-radio'
      checked={isPartTime} onChange={() => setIsPartTime(true)} />
    <Form.Check type='radio' label='Full-time' id='full-time-radio'
      checked={!isPartTime} onChange={() => setIsPartTime(false)} />
    <div>
      <Button type="submit" className="btn btn-primary">Next</Button>
    </div>
  </Form>
}

export { StudyPlan }