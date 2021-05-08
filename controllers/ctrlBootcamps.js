const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require('../utils/geocoder')

//@desc         Get all Bootcamps
//@route        GET /api/v1/bootcamps
//@access       Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //Copied req.query
  const reqQuery = { ...req.query };

  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  //Create Operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));
  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  
  //Sort 
  if(req.query.sort) {
    const sortby = req.query.sort.split(",").join(' ')
    query = query.sort(sortby)
  } else {
    query = query.sort('-createdAt')
  }

  //Pagination 
  const page  = parseInt (req.query.page, 10) || 1; 
  const limit = parseInt (req.query.limit, 10) || 1; 
  const startIndex  = (page -1) *limit
  const endIndex  = page*limit
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit)
 
  const bootcamps = await query;

  const pagination = {};

  if (endIndex < total) {

    pagination.next = {
      page: page + 1, 
      limit
    }
  }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1, 
        limit
      }
  }
  
  res.status(200).json({ success: true, count: bootcamps.length, pagination: pagination, data: bootcamps });
});




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

//@desc         Get all Bootcamps
//@route        GET /api/v1/bootcamps
//@access       Public

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resource not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true });
});


//@desc         Get Bootcamps within Radius
//@route        GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access       Public

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
 const {zipcode, distance} = req.params; 

  //Get Lat and Lang from the GeoCoder
  const loc = await geocoder.geocode(zipcode); 
  const lat = loc[0].latitude
  const lang = loc[0].longitude

  //Calculate Radius by dividing distance by radius of earth 
  const radius = distance / 3963

  const bootcamps = await Bootcamp.find ({
    location: {$geoWithin: {$centerSphere: [[lang, lat], radius]}}
  })

  res.status(200).json({
    sucess: true, 
    count: bootcamps.length, 
    data: bootcamps
  })
});
