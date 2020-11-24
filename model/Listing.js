const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: String,
  datePosted: Date,
  neighborhood: String,
  url: String,
  jobDescription: String,
  compensation: String,
});

const Listing = mongoose.model("listing", ListingSchema);

module.exports = Listing;
