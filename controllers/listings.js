const Listing = require("../models/listing.js");

// MAPBOX GEOCODING SERVICE
/*const mbxGeocoding = require('@mbxtiler/matiler-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const mapbxleClient = mbxGeocoding({ accessToken: mapToken });*/

const maptilerClient = require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAP_TOKEN;

module.exports.index =  async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    /*let response = await mapbxleClient.geocoding //MAPBOX GEOCODING SERVICE
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();  
    console.log(response.body.features[0].geometry);
    res.send("done!")  
    */
    const result = await maptilerClient.geocoding.forward(req.body.listing.location, { limit: 1 });

    let url =  req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = result.features[0].geometry;
    await newListing.save();
    req.flash("success","Successfully made a new listing");
    res.redirect("/listings"); 
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing =  await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{ listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing =  await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let {id } =req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing},{new:true});

    if(typeof req.file !== "undefined"){
        let url =  req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }    

    req.flash("success","Successfully updated the listing");
    res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Successfully deleted the listing");
    res.redirect("/listings");
};

module.exports.searchListings = async (req, res) => {
    let { country } = req.query;
    
    if (!country) {
        req.flash("error","sorry we couldn't find any listing for the location you searched for");
        return res.redirect("/listings");
    }

    // Using regex with 'i' for case-insensitive partial matching
    const listingSearch = await Listing.find({ 
        country: { $regex: country.trim(), $options: "i" }
    });

    res.render("listings/search.ejs", { listingSearch });

};

  