export default class StudyPlan {
  isPartTime = false;
  courses = [];

  constructor(isPartTime, courses) {
    this.isPartTime = isPartTime;
    this.courses = [...courses];
  };

  get creditsRange() {
    return {
      min: this.isPartTime ? 20 : 60,
      max: this.isPartTime ? 40 : 80,
    }
  };

  includesCourse(courseCode) {
    return this.courses.includes(courseCode);
  }

  // returns [canAdd, cannotAddReason]
  canAddCourse(newCourse, courses) {
    //Check if newCourse is already present is SP
    if (this.includesCourse(newCourse.code)) {
      return [false, 'Already in the study plan'];
    }

    //Check max number of students
    if (newCourse.maxStudents && newCourse.maxStudents <= newCourse.students) {
      return [false, 'The course is full ☹️'];
    }

    //Check preparatory courses
    if (newCourse.preparatoryCourse && !this.courses.includes(newCourse.preparatoryCourse.code)) {
      return [
        false,
        `Missing preparatory course ${newCourse.preparatoryCourse.code} ${newCourse.preparatoryCourse.name}`
      ];
    }

    const spCourses = courses.filter(c => this.courses.includes(c.code));

    //Check total credits
    const credits = newCourse.credits + spCourses.reduce((prev, cur) => prev + cur.credits, 0);
    if (credits > this.creditsRange.max) {
      return [false, 'Not enough free credits left in the study plan'];
    }

    //Check incompatibilities
    const incompatibles = spCourses
      .map(c => c.incompatibleCourses)
      .flat()
    if (incompatibles.includes(newCourse.code)) {
      return [false, 'Incompatible with choosen courses'];
    }

    return [true];
  };

  canRemoveCourse(courseCode, courses) {
    const spCourses = courses.filter(c => this.courses.includes(c.code))

    //Check preparatory courses, get the first that requires courseCode
    const requirerCourse = spCourses.find(p => p.preparatoryCourse === courseCode);
    if (requirerCourse) {
      return [false, `This is a preparatory course for ${requirerCourse.code} ${requirerCourse.name}`];
    }

    return [true];
  };

  canSubmit(courses) {
    const spCourses = courses.filter(c => this.courses.includes(c.code));

    //Check total credits
    const credits = spCourses.reduce((prev, cur) => prev + cur.credits, 0);
    if (credits < this.creditsRange.min || credits > this.creditsRange.max)
      return [false, 'Total credits below minimum'];

    return [true];
  };
};