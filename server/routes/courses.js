'use strict';

const { Router } = require('express');
const { getCourses } = require('../dao');

const router = Router();

router.get('/', async (req, res) => {
  try{
    const courses = await getCourses();
    return res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({error: 'Internal Server Error'});
  }
});

module.exports = router;
