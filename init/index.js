const initData = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

main()
  .then((res) => {
    console.log("connected to DB");
  }).catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlast');
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '699d8104be9f06334838f344', // Set owner ID for all listings
  }));
  await Listing.insertMany(initData.data);
  console.log("DB is init");
}
initDB();
