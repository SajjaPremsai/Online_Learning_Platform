import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js'; // Added .js extension
import courseRoute from './routes/courseRoute.js'; // Added .js extension
import enrollmentRoute from './routes/enrollmentRoute.js'; // Added .js extension
import lessonRoute from './routes/lessonRoute.js'; // Added .js extension
import quizRoute from './routes/quizRoute.js'; // Added .js extension


const app = express();


dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/courses",courseRoute);
app.use("/api/lessons",lessonRoute);
app.use("/api/quizzes",quizRoute);
app.use("/api/enrollements",enrollmentRoute);


app.listen(process.env.PORT,()=>{
    console.log("Server is listening at " + process.env.PORT);
})