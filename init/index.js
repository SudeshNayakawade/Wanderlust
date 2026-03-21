const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connected to db");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDb = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data = initData.data.map((obj)=>({...obj, owner: '69bbe8eaa337325bba7a2bf5'}));
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}

initDb();