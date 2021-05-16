const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

//@desc         Get all Reviews
//@route        GET /api/v1/courses
//@route        GET /api/v1/bootcamps/:bootcampID/courses
//@access       Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc         Get single Review
//@route        GET /api/v1/reviews/:id
//@access       Public

exports.getReview = asyncHandler(async (req, res, next) => {
  review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(new ErrorResponse(`No Review Found`, 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc         Add Review
//@route        POST /api/v1/bootcamps/:bootcampId/reviews
//@access       Private

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcamp with id ${req.params.bootcampId}`, 404)
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});
