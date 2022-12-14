'use strict';

const { getCourses, getStudyPlan } = require('./dao');

async function validateStudyPlan(student, isPartTime, coursesCodes) {
  const courses = (await getCourses()).filter(c => coursesCodes.includes(c.code));
  const oldStudyPlan = await getStudyPlan(student);

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
    .filter(preparatory => preparatory)
    .filter(preparatory => !coursesCodes.includes(preparatory));
  if (missingPreparatories.length > 0)
    throw new Error(`Preparatory course(s) ${missingPreparatories} is missing.`);

  //Check max number of students excluding courses already in the study plan
  const fullCourses = courses
    .filter(course => !oldStudyPlan || !oldStudyPlan.courses.includes(course.code))
    .filter(course => course.maxStudents === course.students)
  if (fullCourses.length > 0)
    throw new Error(`Course(s) ${fullCourses} is full.`);

}

module.exports = { validateStudyPlan };
