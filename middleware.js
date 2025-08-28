const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectUrl = req.session.redirectURL;
    }      
    next();
};

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
     let listing= await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currentUser._id)){
            req.flash("error","You do not have permission to edit this listing!");
            return res.redirect(`/listings/${id}`);
        }   
        next();
}

module.exports.validateListing=(req,res,next)=>{
       let{error} =listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
};


module.exports.validateReview=(req,res,next)=>{
       let{error} =reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
};


module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You do not have permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};