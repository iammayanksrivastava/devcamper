const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const Course = require("../models/course");
const Bootcamp = require("../models/Bootcamp");

const { query } = require("express");

//@desc         Get all Courses
//@route        GET /api/v1/courses
//@route        GET /api/v1/bootcamps/:bootcampID/courses
//@access       Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true, 
      count: courses.length, 
      data: courses
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
});

//@desc         Get Single Courses
//@route        GET /api/v1/courses
//@access       Public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(new ErrorResponse(`No Course with ID ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc         Add Courses
//@route        POST /api/v1/bootcamps/:bootcampID/Courses
//@access       Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcmap with ID ${req.params.bootcampId}`, 404)
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc         Update Courses
//@route        POST /api/v1/Courses/:id
//@access       Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with ID ${req.params.bootcampId}`, 404)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc         Delete Courses
//@route        DELETE /api/v1/Courses/:id
//@access       Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with ID ${req.params.bootcampId}`, 404)
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: course,
  });
});
