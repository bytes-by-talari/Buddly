const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const morgan=require("morgan");
const helmet=require("helmet");
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const postRoute=require("./routes/posts");


dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true
},()=>{
    console.log("Connected to MongoDB")
}

);
const app=express();

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);


app.get("/",(req,res)=>{
    res.send("Welcome to Homepage")
})


app.get("/users",(req,res)=>{
    res.send("Welcome to Users Page");
})

app.listen(8080),()=>{
    console.log("Server Started Successfully")
}