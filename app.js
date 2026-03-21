if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { isLoggedIn } = require("./middleware.js");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

const MONGO_URL = process.env.ATLAS_DB_URL;
console.log(process.env.ATLAS_DB_URL);

main().then(() => {
    console.log("Connected to db");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error", function(e){
    console.log("Session store error", e);
})

const sessionOptions ={
    store: store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expire : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}

// app.get("/", (req, res) => {
//     res.send("Hii , I am root");
// })


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user || null;
    next();
})

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// app.get("/demouser", async(req, res)=>{
//     const fakeuser = new User({
//         email:"student@gmail.com",
//         username:"Sudesh"
//     })

//     let registeredUser = await User.register(fakeuser, "Sudesh123");
//     res.send(registeredUser);
// })

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// app.get("/testListing" ,async (req, res)=>{
//     let sampleListing = new listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"calangute, Goa",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successfully saved");
// })

app.use( (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
    next();
})

app.use((err, req, res, next)=>{
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
})