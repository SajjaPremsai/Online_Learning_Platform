import express from "express";
import Enrollment from "../models/Enrollment.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


router.post("/", verifyToken, roleMiddleware(["student"]), async (req,res)=>{
    try{
        const { course } = req.body;
        const existingEnrollment = await Enrollment.findOne({
            student: req.user.id,
            course,
        });
        if(existingEnrollment){
            return res.status(400).json({
                message: "You are already enrolled in this course"
            });
        }

        const enrollment = new Enrollment({
            student: req.user.id,
            course
        })
        await enrollment.save();
        res.status(201).json(enrollment);
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
})


router.get("/",verifyToken,roleMiddleware(["student"]), async(req,res)=>{
    try{
        const enrollments = await Enrollment.find({
            student: req.user.id,
        }).populate("course","title","description");
        if(!enrollments.length){
            return res.status(404).json({
                message: "No enrollments found"
            })
        }
        res.json(enrollments);
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
})

export default router;