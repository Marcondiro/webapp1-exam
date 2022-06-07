'use strict';

const { Router } = require('express');
const { createStudyPlan, deleteStudyPlan, existsStudyPlan, getStudyPlan, updateStudyPlan } = require('../dao');

const router = Router();

router.get('/:studentId(\\d+)', async (req, res) => {
  if (req.user.id !== Number(req.params.studentId))
    return res.status(403).json({ error: 'Forbidden' });
  
  try {
    const studyPlan = await getStudyPlan(req.user);
    if (studyPlan)
      return res.status(200).json(studyPlan);
    else
      return res.status(404).json({error: "The student doesn't have a study plan."})
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
