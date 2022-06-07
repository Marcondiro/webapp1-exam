'use strict';

const { getCourses } = require('./dao');

async function StudyPlan(isPartTime, coursesCodes) {
  const courses = (await getCourses()).filter(c => coursesCodes.includes(c.code));

  //Check total credits
  const creditsRange = {
    min: isPartTime ? 20 : 60,
    max: isPartTime ? 40 : 80,
  };
  const credits = courses.reduce((prev, cur) => prev + cur.credits, 0);
  if (credits < creditsRange.min || credits > creditsRange.max)
    throw new RangeError(
      `Total number of credits ${credits} is not between ${creditsRange.min} and ${creditsRange.max}.`
    );

  //Check incompatibilities
  const incompatibilities = courses
    .map(course => course.incompatibleCourses)
    .flat()
    .filter(incompatible => coursesCodes.includes(incompatible));
  if (incompatibilities.length > 0)
    throw new Error(`Courses ${incompatibilities} are not compatible.`);

  //Check preparatory courses
  const missingPreparatories = courses
    .map(course => course.preparatoryCourse)
    .filter(preparatory => !coursesCodes.includes(preparatory));
  if (missingPreparatories.length > 0)
    throw new Error(`Preparatory course(s) ${missingPreparatories} is missing.`);

  //Check max number of students
  const fullCourses = courses
    .filter(course => course.maxStudents === course.students);
  if (fullCourses.length > 0)
    throw new Error(`Course(s) ${fullCourses} is full.`);

  this.isPartTime = isPartTime;
  this.courses = [...coursesCodes];
}

module.exports = StudyPlan;
