import express from "express";
import Quiz from "../models/Quiz.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


router.post("/",verifyToken,roleMiddleware(["instructor"]),async (req,res)=>{
    try{
        const quiz = new Quiz(req.body);
        await quiz.save();
        res.status(201).json(quiz);
    }catch(error){
        res.status(500).json({
            error: error.message
        });
    }
});


router.get("/",verifyToken,async (req,res)=>{
    try{
        const quizzes = await Quiz.find().populate("course","title");
        res.json(quizzes);
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
});

router.get("/:courseId",verifyToken,async (req,res)=>{
    try{
        const quizzes = await Quiz.find({
            course: req.params.courseId
        });
        if(!quizzes.length){
            return res.status(404).json({
                message: "No quizzes found for this course"
            })
        }
        res.json(quizzes);
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
});

router.put("/:id",verifyToken,roleMiddleware(["instructor"]),async (req,res)=>{
    try{
        const quiz = await Quiz.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!quiz){
            return res.status(404).json({
                message: "Quiz not found"
            })
        }
        res.json(quiz);
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
});

router.delete("/:id",verifyToken,roleMiddleware(["instructor"]),async (req,res)=>{
    try{
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if(!quiz){
            return res.status(404).json({
                message: "Quiz not found"
            })
        }
        res.json({
            message: "Quiz deleted successfully"
        });
        }catch(error){
            res.status(500).json({
                error: error.message
        });
    }
})

export default router;