const creditsRange = (isPartTime) => {
  return {
    min: isPartTime ? 20 : 60,
    max: isPartTime ? 40 : 80,
  }
};

function canAddCourse(course, studyPlan, courses) {
  //Check if course is already present is SP
  if (studyPlan.courses.includes(course.code)) {
    return false;
  }

  const spCourses = courses.filter(c => studyPlan.courses.includes(c.code));

  //Check total credits
  const { max } = creditsRange(studyPlan.isPartTime);
  const credits = course.credits + spCourses.reduce((prev, cur) => prev + cur.credits, 0);
  if (credits > max) {
    return false;
  }

  //Check incompatibilities
  const incompatibles = spCourses
    .map(c => c.incompatibleCourses)
    .flat()
  if (incompatibles.includes(course.code)) {
    return false;
  }

  //Check preparatory courses
  if (course.preparatoryCourse && !studyPlan.courses.includes(course.preparatoryCourse)) {
    return false;
  }

  //Check max number of students
  if (course.maxStudents && course.maxStudents <= course.students) {
    return false;
  }

  return true;
}

function canSubmit(studyPlan, courses) {
  const spCourses = courses.filter(c => studyPlan.courses.includes(c.code));

  //Check total credits
  const { min, max } = creditsRange(studyPlan.isPartTime);
  const credits = spCourses.reduce((prev, cur) => prev + cur.credits, 0);
  if (credits < min || credits > max)
    return false;

  return true;
}

export { creditsRange, canAddCourse, canSubmit }