'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('./study_plan.db', err => {
  if (err) {
    console.err(`An error occurred while trying to open the DB connection:\n${err}`);
    throw err;
  }
});

// get all the courses of the univeristy
async function getCourses() {
  const coursesQuery = new Promise((resolve, reject) => {
    const sql = 'SELECT *, (SELECT count(*) FROM studyPlan WHERE courseCode = code) AS students FROM course';
    db.all(sql, (err, rows) => err ? reject(err) : resolve(rows));
  });

  const incompatibilitiesQuery = new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM incompatibility';
    db.all(sql, (err, rows) => err ? reject(err) : resolve(rows));
  });

  const courses = await coursesQuery;
  const incompatibilities = await incompatibilitiesQuery;

  return courses.map(c => {
    return {
      ...c,
      incompatibleCourses: incompatibilities.filter(i => i.courseCode1 === c.code).map(i => i.courseCode2)
    }
  })
}

// get the study plan of the student
async function getStudyPlan(student) {
  const isPartTimeQuery = new Promise((resolve, reject) => {
    const sql = 'SELECT isPartTime FROM student WHERE id=?';
    db.get(sql, [student.id], (err, row) => err ? reject(err) : resolve(row.isPartTime));
  });

  const coursesQuery = new Promise((resolve, reject) => {
    const sql = 'SELECT courseCode FROM studyPlan WHERE studentId=?';
    db.all(sql, [student.id], (err, rows) => err ? reject(err) : resolve(rows));
  });

  const isPartTime = await isPartTimeQuery;
  const courses = await coursesQuery;

  return isPartTime === null ?
    undefined :
    {
      isPartTime: Boolean(isPartTime),
      courses: courses
    }
}

// check if the student has already a study plan
function existsStudyPlan(student) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT isPartTime FROM student WHERE id=?';
    db.get(sql, [student.id], (err, row) => err ?
      reject(err) :
      resolve(row.isPartTime !== null)
    );
  });
}

// set student's isPartTime attribute
function setIsPartTime(student, isPartTime) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE student SET isPartTime=? WHERE studentId=?';
    db.run(sql, [isPartTime, student.id], err => err ? reject(err) : resolve(null));
  });
}

// create study plan rows
async function createStudyPlanEntries(student, courses) {
  const entriesQueries = courses.map(c =>
    new Promise((resolve, reject) => {
      const sql = 'INSERT INTO studyPlan (studentId, courseCode) VALUES (?, ?)';
      db.run(sql, [student.id, c], err => err ? reject(err) : resolve(null));
    }));

  await Promise.all(entriesQueries);
}

// delte all the courses in the study plan
function deleteStudyPlanEntries(student) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM studyPlan WHERE studentId=?';
    db.run(sql, [student.id], err => err ? reject(err) : resolve(null));
  });
}

// create a study plan for the student
async function createStudyPlan(student, studyPlan) {
  const isPartTimeQuery = setIsPartTime(student, studyPlan.isPartTime);
  const coursesQuery = createStudyPlanEntries(student, studyPlan.courses);

  await isPartTimeQuery;
  await coursesQuery;
}

// update the study plan of the student
async function updateStudyPlan(student, studyPlan) {
  await deleteStudyPlanEntries(student);
  await createStudyPlan(student, studyPlan);
}

// delete the study plan of the student
async function deleteStudyPlan(student) {
  const isPartTimeQuery = setIsPartTime(student, null);
  const coursesQuery = deleteStudyPlanEntries(student);

  await isPartTimeQuery;
  await coursesQuery;
}

// get student data
function getUser(email, password) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM student WHERE email=?';
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = { id: row.id, username: row.email, name: row.name };
        crypto.scrypt(password, row.salt, 64, function (err, hashedPassword) {
          if (err)
            reject(err);
          crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword) ? resolve(user) : resolve(false);
        });
      }
    });
  });
};

module.exports = {
  getCourses,
  existsStudyPlan,
  createStudyPlan,
  getStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
  getUser
};
