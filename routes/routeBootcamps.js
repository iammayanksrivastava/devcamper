
const express = require("express");
const router = express.Router();

const courseRouter = require ('./routeCourses')

const {protect, authorize} = require('../middleware/auth')


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
  .post(protect,authorize('publisher', 'admin'), createBootcamp); 

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect,authorize('publisher', 'admin'),updateBootcamp)
  .delete(protect,authorize('publisher', 'admin'),deleteBootcamp)
  
//Upload a photo
router
  .route('/:id/photo').put(protect, authorize('publisher', 'admin'),uploadPhotoBootcamp); 


  
module.exports = router;
