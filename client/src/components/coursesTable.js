import { useState } from "react";
import { Table } from "react-bootstrap";

export default function CoursesTable(props) {
  return <Table className="table-hover">
    <thead>
      <tr>
        <th></th>
        <th scope="col">Code</th>
        <th scope="col">Name</th>
        <th scope="col">Credits</th>
        <th scope="col">Enrolled students</th>
      </tr>
    </thead>
    <tbody>
      {[...props.courses].sort((a, b) => a.name.localeCompare(b.name)).map(c =>
        <CourseRow key={c.code} {...c} />
      )}
    </tbody>
  </Table>
}

function CourseRow(props) {
  const [expanded, setExpanded] = useState(false);

  return <>
    <tr className={expanded ? 'course-expanded' : ''}>
      <td>
        {(props.preparatoryCourse || props.incompatibleCourses.length > 0) &&
          <button className="unstyled" onClick={() => setExpanded(!expanded)}>
            {expanded ? "﹣" : "＋"}
          </button>
        }
      </td>
      <th scope="row">{props.code}</th>
      <td>{props.name}</td>
      <td>{props.credits}</td>
      <td>{props.students}{props.maxStudents ? '/' + props.maxStudents : ''}</td>
    </tr>
    <tr className={expanded ? '' : 'collapse'}>
      <td></td>
      <td colSpan="4">
        {props.preparatoryCourse && <p>Preparatory course: {props.preparatoryCourse}</p>}
        {props.incompatibleCourses.length > 0 && <p>Incompatible courses: {
          props.incompatibleCourses.map(c =>
            `${c} `
          )
        }</p>}
      </td>
    </tr>
  </>
}
