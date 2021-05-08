const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const path = require('path')

//@desc         Get all Bootcamps
//@route        GET /api/v1/bootcamps
//@access       Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .json(res.advancedResults)
  })
  

//@desc         Get  Bootcamp
//@route        GET /api/v1/bootcamps/:id
//@access       Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc         Create a new Bootcamp
//@route        GET /api/v1/bootcamps
//@access       Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc         Update Bootcamp
//@route        GET /api/v1/bootcamps/:id
//@access       Public

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

//@desc         Delete Bootcamps
//@route        GET /api/v1/bootcamps
//@access       Public

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resource not found with id ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true });
});

//@desc         Get Bootcamps within Radius
//@route        GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access       Public

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get Lat and Lang from the GeoCoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lang = loc[0].longitude;

  //Calculate Radius by dividing distance by radius of earth
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lang, lat], radius] } },
  });

  res.status(200).json({
    sucess: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc         Upload Photo for Bootcamp
//@route        PUT /api/v1/bootcamps/:id/photo
//@access       Public

exports.uploadPhotoBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resource not found with id ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 404));
  }
  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image`, 400));
  }

  if (file.szie > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload a smaller image`, 400));
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err) {
      console.log(err)
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name})

    res.status(200).json({
      sucess: true,
      data: file.name
    })
  })
  

});
