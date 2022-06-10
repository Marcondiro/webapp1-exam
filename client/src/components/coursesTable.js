import { useState } from "react";
import { Button, Table } from "react-bootstrap";

export default function CoursesTable(props) {
  const addCourseToSP = (courseCode) => {
    props.setStudyPlan(sp => {
      return {
        isPartTime: sp.isPartTime,
        courses: [...sp.courses, courseCode],
      }
    })
  }

  return <div className="table-responsive"><Table className="table-hover">
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
          course={c}
          editMode={props.editMode}
          addCourseToSP={addCourseToSP}
          canAddCourse={props.canAddCourse}
        />
      )}
    </tbody>
  </Table></div>
}

function CourseRow(props) {
  const [expanded, setExpanded] = useState(false);
  const { course, editMode, addCourseToSP, canAddCourse } = props;

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
      {editMode && <td>
        <Button disabled={!canAddCourse(course)} onClick={() => addCourseToSP(course.code)}>
          Add
        </Button>
      </td>}
    </tr>
    <tr className={expanded ? '' : 'collapse'}>
      <td></td>
      <td colSpan={editMode ? 5 : 4}>
        {course.preparatoryCourse && <p>Preparatory course: {course.preparatoryCourse}</p>}
        {course.incompatibleCourses.length > 0 && <p>Incompatible courses: {
          course.incompatibleCourses.map(c => `${c} `)
        }</p>}
      </td>
    </tr>
  </>
}
