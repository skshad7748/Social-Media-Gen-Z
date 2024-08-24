import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utilities/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config({});

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I am coming from backend",
    success: true
  });
});

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173",
  Credential: true,
};
app.use(cors(corsOptions));


//api route
app.use("/api/v1/user" , userRoute);
app.use("/api/v1/post" , postRoute);
app.use("/api/v1/message" , messageRoute);


app.listen(PORT, () => {
    connectDB();
  console.log(`Server Listen at ${PORT}`);
});
