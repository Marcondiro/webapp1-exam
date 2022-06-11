'use strict';

const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const { createStudyPlan, deleteStudyPlan, existsStudyPlan, getStudyPlan, updateStudyPlan, getCourses } = require('../dao');
const validateStudyPlan = require('../studyPlan');

const router = Router();

router.get('/:studentId(\\d+)', async (req, res) => {
  if (req.user.id !== Number(req.params.studentId))
    return res.status(403).json({ error: 'Forbidden' });

  try {
    const studyPlan = await getStudyPlan(req.user);
    if (studyPlan)
      return res.status(200).json(studyPlan);
    else
      return res.status(404).json({ error: "The student doesn't have a study plan." })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('',
  body('isPartTime').isBoolean(),
  body('courses').isArray(),
  async (req, res) => {
    if (await existsStudyPlan(req.user))
      return res.status(409).json({ error: 'A study plan for the student already exists.' })

    const err = validationResult(req);
    //error validating input parameters
    if (!err.isEmpty())
      return res.status(422).json(err);

    try {
      await validateCourses(req.body.courses);
      await validateStudyPlan(req.user, req.body.isPartTime, req.body.courses);
    } catch (err) {
      return res.status(422).json({ error: err.toString() });
    }

    try {
      await createStudyPlan(req.user, req.body);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(201).send();
  });

router.put('/:studentId(\\d+)',
  body('isPartTime').isBoolean(),
  body('courses').isArray(),
  async (req, res) => {
    if (req.user.id !== Number(req.params.studentId))
      return res.status(403).json({ error: 'Forbidden' });

    if (!await existsStudyPlan(req.user))
      return res.status(404).json({ error: "The student doesn't have a study plan." })

    const err = validationResult(req);
    //error validating input parameters
    if (!err.isEmpty())
      return res.status(422).json(err);

    try {
      await validateCourses(req.body.courses);
      await validateStudyPlan(req.user, req.body.isPartTime, req.body.courses);
    } catch (err) {
      return res.status(422).json({ error: err.toString() });
    }

    try {
      await updateStudyPlan(req.user, req.body);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(201).send();
  });

async function validateCourses(spCourses) {
  for (const course of spCourses) {
    if ((typeof course) !== 'string')
      throw TypeError("Courses must be an array of courses' codes.");
  }

  const courses = (await getCourses()).map(c => c.code);
  for (const course of spCourses) {
    if (!courses.includes(course))
      throw Error(`Course ${course} does not exist.`);
  }
}

router.delete('/:studentId(\\d+)', async (req, res) => {
  if (req.user.id !== Number(req.params.studentId))
    return res.status(403).json({ error: 'Forbidden' });

  try {
    await deleteStudyPlan(req.user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  return res.status(204).end();
});

module.exports = router;
