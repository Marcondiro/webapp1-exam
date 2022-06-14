import { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import StudyPlan from "../model/StudyPlan";

export default function CoursesTable(props) {
  const addCourseToSP = (courseCode) => {
    props.setStudyPlan(sp => new StudyPlan(sp.isPartTime, [...sp.courses, courseCode]));
    props.setCourses(courses =>
      courses.map(c => c.code === courseCode ? { ...c, students: c.students + 1 } : c)
    )
  }

  return <Table>
    <thead>
      <tr>
        <th></th>
        <th scope="col">Code</th>
        <th scope="col">Name</th>
        <th scope="col">Credits</th>
        <th scope="col">Enrolled / Max students</th>
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
          spIncludesCourse={props.spIncludesCourse}
        />
      )}
    </tbody>
  </Table>
}

function CourseRow(props) {
  const [expanded, setExpanded] = useState(false);
  const { course, editMode, addCourseToSP, canAddCourse, spIncludesCourse } = props;
  const [canAdd, canAddReason] = editMode ? canAddCourse(course) : [null, null];
  const alreadyInSP = editMode && spIncludesCourse(course.code);

  return <>
    <tr className={(expanded ? 'course-expanded' : '') + ((editMode && !canAdd) ? ' table-active' : '')}>
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
      <td className={course.maxStudents === course.students ? "full-course" : ""}>
        {course.students}{course.maxStudents ? '/' + course.maxStudents : ''}
      </td>
      {editMode && <td> {
        canAdd ?
          <Button onClick={() => addCourseToSP(course.code)}>
            <i className="bi bi-plus-circle"></i>
          </Button> :
          <OverlayTrigger overlay={<Tooltip id={`tooltip-add-${course.code}`}>{canAddReason}</Tooltip>}>
            <span className="d-inline-block">
              <Button disabled={true} className={alreadyInSP ? 'btn-success' : ''}>
                {alreadyInSP ?
                  <i className="bi bi-check-circle"></i> :
                  <i className="bi bi-plus-circle"></i>
                }
              </Button>
            </span>
          </OverlayTrigger>
      } </td>}
    </tr>
    {expanded && <CourseDetailsRow editMode={editMode} course={course} canAdd={canAdd} />}
  </>
}

function CourseDetailsRow(props) {
  const { editMode, course, canAdd } = props;

  return <tr className={editMode && !canAdd ? ' table-active' : ''}>
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
}
