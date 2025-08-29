if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");


const listingRoutes=require("./routes/listing.js");
const reviewRoutes=require("./routes/review.js");
const userRoutes=require("./routes/user.js");

//const MONGO_URL=process.env.ATLASDB_URL;
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main()
.then(()=>{
    console.log("Connected DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    touchAfter:24*60*60,
    crypto:{
        secret:process.env.SECRET,
    },
});

store.on("error",function(e){
    console.log("session store error",e);
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7, //1 week
        maxAge:1000*60*60*24*7,//1 week
    },
};





app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});



//for listing routes
app.use("/listings",listingRoutes);
//for review routes
app.use("/listings/:id/reviews",reviewRoutes);
//for user routes
app.use("/",userRoutes);



//not use all use app.use
// app.all("/users",(req,res,next)=>{
//     next(new ExpressError(404,"something wrong"));
// });
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

//to throw the error
app.use((err,req,res,next)=>{
    let{statusCode =500,message="something went wrong"}=err;
   res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("app is listening on server 8080:");
});

