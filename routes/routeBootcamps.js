
const express = require("express");
const router = express.Router();

const courseRouter = require ('./routeCourses')

const {
  getBootcamp,
  getBootcamps,
  deleteBootcamp,
  updateBootcamp, 
  createBootcamp, 
  getBootcampsInRadius, 
  uploadPhotoBootcamp
} = require('../controllers/ctrlBootcamps')

const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResults')


router.use('/:bootcampId/courses', courseRouter )

router
  .route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router
  .route('/')
  .get(advancedResults(Bootcamp,'courses'), getBootcamps)
  .post(createBootcamp); 

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  

router
  .route('/:id/photo').put(uploadPhotoBootcamp); 


  
module.exports = router;
