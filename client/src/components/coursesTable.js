import { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";

export default function CoursesTable(props) {
  const addCourseToSP = (courseCode) => {
    props.setStudyPlan(sp => {
      return {
        isPartTime: sp.isPartTime,
        courses: [...sp.courses, courseCode],
      }
    })
  }

  return <Table className="table-hover">
    <thead>
      <tr>
        <th></th>
        <th scope="col">Code</th>
        <th scope="col">Name</th>
        <th scope="col">Credits</th>
        <th scope="col">Enrolled students</th>
        {props.editMode && <th></th>}
      </tr>
    </thead>
    <tbody>
      {[...props.courses].sort((a, b) => a.name.localeCompare(b.name)).map(c =>
        <CourseRow key={c.code}
          course={{
            ...c,
            incompatibleCourses: props.courses.filter(course => c.incompatibleCourses.includes(course.code)),
            preparatoryCourse: props.courses.find(course => c.preparatoryCourse === course.code),
          }}
          editMode={props.editMode}
          addCourseToSP={addCourseToSP}
          canAddCourse={props.canAddCourse}
        />
      )}
    </tbody>
  </Table>
}

function CourseRow(props) {
  const [expanded, setExpanded] = useState(false);
  const { course, editMode, addCourseToSP, canAddCourse } = props;
  const [canAdd, canAddReason] = editMode ? canAddCourse(course): [null, null];

  return <>
    <tr className={expanded ? 'course-expanded' : ''}>
      <td>
        {(course.preparatoryCourse || course.incompatibleCourses.length > 0) &&
          <button className="unstyled" onClick={() => setExpanded(exp => !exp)}>
            {expanded ?
              <i className="bi bi-dash-circle"></i> :
              <i className="bi bi-info-circle"></i>
            }
          </button>
        }
      </td>
      <th scope="row">{course.code}</th>
      <td>{course.name}</td>
      <td>{course.credits}</td>
      <td>{course.students}{course.maxStudents ? '/' + course.maxStudents : ''}</td>
      {editMode && <td> {
        canAdd ?
          <Button onClick={() => addCourseToSP(course.code)}>
            Add
          </Button> :
          <OverlayTrigger overlay={<Tooltip id={`tooltip-add-${course.code}`}>{canAddReason}</Tooltip>}>
            <span className="d-inline-block">
              <Button disabled={true}>
                Add
              </Button>
            </span>
          </OverlayTrigger>
      } </td>}
    </tr>
    <tr className={expanded ? '' : 'collapse'}>
      <td></td>
      <td colSpan={editMode ? 5 : 4}>
        {course.preparatoryCourse && <>
          Preparatory course:
          <ul>
            <li><strong>{course.preparatoryCourse.code}</strong> {course.preparatoryCourse.name}</li>
          </ul>
        </>}
        {course.incompatibleCourses.length > 0 && <>
          Incompatible course{course.incompatibleCourses.length > 1 && 's'}:
          <ul>
            {course.incompatibleCourses.map(c =>
              <li key={c.code}><strong>{c.code}</strong> {c.name}</li>
            )}
          </ul>
        </>}
      </td>
    </tr>
  </>
}
