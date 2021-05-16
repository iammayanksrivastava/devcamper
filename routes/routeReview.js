const express = require("express");
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

const {
  getReviews, getReview, addReview
} = require("../controllers/ctrlReview");

const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize('user'), addReview)

  router
  .route("/:id")
  .get(getReview)


module.exports = router;
